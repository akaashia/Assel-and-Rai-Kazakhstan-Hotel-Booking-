from datetime import date
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field

class HotelOut(BaseModel):
    id: int
    name: str
    city: str
    address: str

    class Config:
        from_attributes = True

class RoomOut(BaseModel):
    id: int
    hotel_id: int
    number: str
    room_type: str
    capacity: int
    price: Decimal
    status: str

    class Config:
        from_attributes = True

class ClientCreate(BaseModel):
    full_name: str = Field(min_length=2)
    phone: str = Field(min_length=5)
    email: str

class ClientOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: str

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    room_id: int
    client_id: int
    check_in: date
    check_out: date

class BookingOut(BaseModel):
    id: int
    room_id: int
    client_id: int
    check_in: date
    check_out: date
    status: str

    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    booking_id: int
    amount: Decimal
    method: str = "card"

class PaymentOut(BaseModel):
    id: int
    booking_id: int
    amount: Decimal
    status: str
    method: str

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    question: str
