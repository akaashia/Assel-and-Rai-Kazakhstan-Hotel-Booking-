from datetime import date
from sqlalchemy.orm import Session
from .models import Booking, Client, Hotel, Payment, Room


def seed_data(db: Session) -> None:
    if db.query(Hotel).count() > 0:
        return

    hotels = [
        Hotel(name="Kazakhstan Grand Hotel", city="Astana", address="Mangilik El 10"),
        Hotel(name="Almaty Comfort Hotel", city="Almaty", address="Abay 25"),
    ]
    db.add_all(hotels)
    db.flush()

    rooms = [
        Room(hotel_id=hotels[0].id, number="101", room_type="standard", capacity=2, price=25000),
        Room(hotel_id=hotels[0].id, number="102", room_type="comfort", capacity=2, price=35000),
        Room(hotel_id=hotels[0].id, number="201", room_type="lux", capacity=3, price=55000),
        Room(hotel_id=hotels[0].id, number="202", room_type="family", capacity=4, price=65000),
        Room(hotel_id=hotels[1].id, number="301", room_type="standard", capacity=2, price=22000),
        Room(hotel_id=hotels[1].id, number="302", room_type="comfort", capacity=2, price=32000),
        Room(hotel_id=hotels[1].id, number="401", room_type="lux", capacity=3, price=50000),
        Room(hotel_id=hotels[1].id, number="402", room_type="family", capacity=4, price=60000),
    ]
    db.add_all(rooms)
    db.flush()

    clients = [
        Client(full_name="Aigerim Saparova", phone="+77010000001", email="aigerim@mail.kz"),
        Client(full_name="Dias Omarov", phone="+77010000002", email="dias@mail.kz"),
        Client(full_name="Assel Kim", phone="+77010000003", email="assel@mail.kz"),
    ]
    db.add_all(clients)
    db.flush()

    bookings = [
        Booking(room_id=rooms[0].id, client_id=clients[0].id, check_in=date(2026, 5, 1), check_out=date(2026, 5, 3), status="confirmed"),
        Booking(room_id=rooms[1].id, client_id=clients[1].id, check_in=date(2026, 5, 4), check_out=date(2026, 5, 6), status="confirmed"),
        Booking(room_id=rooms[2].id, client_id=clients[2].id, check_in=date(2026, 5, 7), check_out=date(2026, 5, 10), status="created"),
        Booking(room_id=rooms[4].id, client_id=clients[0].id, check_in=date(2026, 5, 11), check_out=date(2026, 5, 13), status="confirmed"),
        Booking(room_id=rooms[5].id, client_id=clients[1].id, check_in=date(2026, 5, 14), check_out=date(2026, 5, 16), status="created"),
    ]
    db.add_all(bookings)
    db.flush()

    payments = [
        Payment(booking_id=bookings[0].id, amount=50000, status="paid", method="card"),
        Payment(booking_id=bookings[1].id, amount=70000, status="paid", method="cash"),
        Payment(booking_id=bookings[2].id, amount=165000, status="pending", method="card"),
        Payment(booking_id=bookings[3].id, amount=44000, status="paid", method="kaspi"),
        Payment(booking_id=bookings[4].id, amount=64000, status="pending", method="card"),
    ]
    db.add_all(payments)
    db.commit()
