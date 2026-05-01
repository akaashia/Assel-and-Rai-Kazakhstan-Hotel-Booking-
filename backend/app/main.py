import os
import time
from datetime import date
from decimal import Decimal
from typing import Optional

import requests
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from .database import Base, SessionLocal, engine
from .models import Booking, Client, Hotel, Payment, Room
from .schemas import BookingCreate, BookingOut, ChatRequest, ClientCreate, ClientOut, HotelOut, PaymentCreate, PaymentOut, RoomOut
from .seed import seed_data

app = FastAPI(title="Kazakhstan Hotel Booking API", version="1.0.0")

origins = [os.getenv("FRONTEND_URL", "http://localhost"), "http://localhost", "http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REQUEST_COUNT = Counter("hotel_api_requests_total", "Total HTTP requests", ["method", "endpoint", "status"])
REQUEST_LATENCY = Histogram("hotel_api_request_duration_seconds", "HTTP request latency", ["endpoint"])

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    endpoint = request.url.path
    REQUEST_COUNT.labels(request.method, endpoint, str(response.status_code)).inc()
    REQUEST_LATENCY.labels(endpoint).observe(time.time() - start)
    return response

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"project": "Kazakhstan Hotel Booking", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/hotels", response_model=list[HotelOut])
def get_hotels(db: Session = Depends(get_db)):
    return db.query(Hotel).order_by(Hotel.id).all()

@app.post("/clients", response_model=ClientOut)
def create_client(data: ClientCreate, db: Session = Depends(get_db)):
    existing = db.query(Client).filter(Client.email == data.email).first()
    if existing:
        return existing
    client = Client(full_name=data.full_name, phone=data.phone, email=data.email)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@app.get("/rooms", response_model=list[RoomOut])
def get_rooms(
    hotel_id: Optional[int] = None,
    check_in: Optional[date] = None,
    check_out: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Room)
    if hotel_id:
        query = query.filter(Room.hotel_id == hotel_id)

    if check_in and check_out:
        busy_room_ids = db.query(Booking.room_id).filter(
            Booking.status != "cancelled",
            and_(Booking.check_in < check_out, Booking.check_out > check_in),
        )
        query = query.filter(~Room.id.in_(busy_room_ids))

    return query.order_by(Room.hotel_id, Room.number).all()

@app.post("/bookings", response_model=BookingOut)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    if data.check_out <= data.check_in:
        raise HTTPException(status_code=400, detail="check_out must be after check_in")

    room = db.query(Room).filter(Room.id == data.room_id).first()
    client = db.query(Client).filter(Client.id == data.client_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    overlap = db.query(Booking).filter(
        Booking.room_id == data.room_id,
        Booking.status != "cancelled",
        Booking.check_in < data.check_out,
        Booking.check_out > data.check_in,
    ).first()
    if overlap:
        raise HTTPException(status_code=409, detail="Room is already booked for these dates")

    booking = Booking(room_id=data.room_id, client_id=data.client_id, check_in=data.check_in, check_out=data.check_out, status="created")
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@app.get("/bookings/{booking_id}")
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {
        "id": booking.id,
        "status": booking.status,
        "check_in": booking.check_in,
        "check_out": booking.check_out,
        "client": {
            "id": booking.client.id,
            "full_name": booking.client.full_name,
            "phone": booking.client.phone,
            "email": booking.client.email,
        },
        "room": {
            "id": booking.room.id,
            "number": booking.room.number,
            "room_type": booking.room.room_type,
            "price": float(booking.room.price),
            "hotel": booking.room.hotel.name,
        },
        "payment": None if not booking.payment else {
            "id": booking.payment.id,
            "amount": float(booking.payment.amount),
            "status": booking.payment.status,
            "method": booking.payment.method,
        },
    }

@app.post("/payments", response_model=PaymentOut)
def create_payment(data: PaymentCreate, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    existing = db.query(Payment).filter(Payment.booking_id == data.booking_id).first()
    if existing:
        existing.amount = Decimal(data.amount)
        existing.method = data.method
        existing.status = "paid"
        db.commit()
        db.refresh(existing)
        return existing

    payment = Payment(booking_id=data.booking_id, amount=data.amount, method=data.method, status="paid")
    db.add(payment)
    booking.status = "confirmed"
    db.commit()
    db.refresh(payment)
    return payment

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


def ask_gemini(question: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return "GEMINI_API_KEY is not configured in .env"

    prompt = (
        "Сен Қазақстандағы отель брондау жүйесінің AI ассистентісің. "
        "Қысқа, түсінікті және пайдалы жауап бер. "
        f"Пайдаланушы сұрағы: {question}"
    )
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        r = requests.post(url, json=payload, timeout=25)
        r.raise_for_status()
        data = r.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as exc:
        return (
            "Қонақүй брондау жүйесі отельдерді, бөлмелерді, клиенттерді, "
            "броньдарды және төлемдерді басқаруға арналған. "
            "Жүйеде FastAPI backend, PostgreSQL дерекқоры, React frontend, "
            "Nginx reverse proxy, Docker Compose, Prometheus, Grafana, "
            "Jenkins, n8n және Terraform/Ansible автоматтандыруы бар. "
            "Gemini API уақытша қолжетімсіз болғандықтан fallback жауап қайтарылды."
        )

@app.get("/v1/assistant")
def assistant_get(question: str):
    return {"answer": ask_gemini(question)}

@app.post("/v1/chat")
def assistant_post(data: ChatRequest):
    return {"answer": ask_gemini(data.question)}
