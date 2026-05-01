import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Star, Users, Maximize, MapPin, Calendar, AlertCircle, PawPrint } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Room } from '../lib/types';
import { paidExtras, services, news } from '../lib/mock-data';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface RoomDetailDialogProps {
  room: Room;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (roomId: string) => void;
  isFavorite: boolean;
}

export function RoomDetailDialog({ room, open, onClose, onToggleFavorite, isFavorite }: RoomDetailDialogProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return room.price;

    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    let roomTotal = room.price * days;

    // Apply discount
    let discount = 0;
    if (days >= 7) discount = 10;
    else if (days >= 5) discount = 4;

    roomTotal = roomTotal * (1 - discount / 100);

    // Add extras
    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const extra = paidExtras.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);

    // Add services
    const servicesTotal = selectedServices.reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);

    return Math.round(roomTotal + extrasTotal + servicesTotal);
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error('Күндерді таңдаңыз');
      return;
    }

    const booking = {
      roomId: room.id,
      roomName: room.nameKz,
      checkIn,
      checkOut,
      guests,
      selectedExtras,
      selectedServices,
      totalPrice: calculateTotalPrice()
    };

    // Save to localStorage (mock booking)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    toast.success('Бронь сәтті жасалды!');
    onClose();
  };

  const days = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const discount = days >= 7 ? 10 : days >= 5 ? 4 : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-foreground">{room.nameKz}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(room.id)}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-primary' : ''}`} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Left Column - Details */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="space-y-2">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={room.images[currentImageIndex]}
                  alt={room.nameKz}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${room.nameKz} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{room.categoryKz}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-foreground">{room.rating}</span>
                    <span className="text-muted-foreground">({room.reviews} пікір)</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{room.descriptionKz}</p>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="gap-2">
                    <MapPin className="w-4 h-4" />
                    {room.floor} қабат
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <Users className="w-4 h-4" />
                    {room.maxGuests} адамға дейін
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <Maximize className="w-4 h-4" />
                    {room.size} м²
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="text-foreground mb-2">Жайлылықтар:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {room.amenitiesKz.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span style={{ fontSize: '0.875rem' }}>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-2">Мүмкіндіктер:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {room.featuresKz.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span style={{ fontSize: '0.875rem' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <PawPrint className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-foreground mb-1">Маңызды ескерту</h4>
                      <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        Үй жануарларына рұқсат етілмейді
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Paid Extras */}
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-foreground">Қосымша төлемді қызметтер:</h4>
                <div className="space-y-3">
                  {paidExtras.map(extra => (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={extra.id}
                          checked={selectedExtras.includes(extra.id)}
                          onCheckedChange={(checked) => {
                            setSelectedExtras(prev =>
                              checked
                                ? [...prev, extra.id]
                                : prev.filter(id => id !== extra.id)
                            );
                          }}
                        />
                        <label htmlFor={extra.id} className="text-foreground cursor-pointer">
                          {extra.nameKz}
                        </label>
                      </div>
                      <span className="text-muted-foreground">
                        {extra.price.toLocaleString()} ₸
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room News */}
            {news.length > 0 && (
              <Card className="border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <h4 className="text-foreground">Жаңалықтар:</h4>
                  {news.slice(0, 2).map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex gap-4">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.titleKz}
                          className="w-24 h-24 object-cover"
                        />
                        <div className="flex-1 p-4">
                          <h5 className="text-foreground mb-1">{item.titleKz}</h5>
                          <p className="text-muted-foreground line-clamp-2" style={{ fontSize: '0.875rem' }}>
                            {item.contentKz}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-4">
            <Card className="border-primary/20 sticky top-4">
              <CardContent className="p-6 space-y-4">
                <div className="text-center pb-4 border-b border-border">
                  <p className="text-muted-foreground mb-1">Түнге баға</p>
                  <p className="text-3xl text-primary">
                    {room.price.toLocaleString()} ₸
                  </p>
                </div>

                {/* Calendar */}
                <div>
                  <label className="text-foreground mb-2 block">Кіру күні:</label>
                  <CalendarComponent
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border border-border"
                  />
                </div>

                <div>
                  <label className="text-foreground mb-2 block">Шығу күні:</label>
                  <CalendarComponent
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => !checkIn || date <= checkIn}
                    className="rounded-md border border-border"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="text-foreground mb-2 block">
                    Қонақтар саны:
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                  >
                    {[...Array(room.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} адам
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Services */}
                <div>
                  <label className="text-foreground mb-2 block">
                    Қосымша қызметтер:
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {services.slice(0, 6).map(service => (
                      <div key={service.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={service.id}
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={(checked) => {
                              setSelectedServices(prev =>
                                checked
                                  ? [...prev, service.id]
                                  : prev.filter(id => id !== service.id)
                              );
                            }}
                          />
                          <label htmlFor={service.id} className="cursor-pointer text-foreground">
                            {service.nameKz}
                          </label>
                        </div>
                        {service.price > 0 && (
                          <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                            {service.price.toLocaleString()} ₸
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Summary */}
                {checkIn && checkOut && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{room.price.toLocaleString()} ₸ × {days} түн</span>
                      <span>{(room.price * days).toLocaleString()} ₸</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Жеңілдік ({discount}%)</span>
                        <span>-{Math.round(room.price * days * discount / 100).toLocaleString()} ₸</span>
                      </div>
                    )}
                    {selectedExtras.length > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Қосымша қызметтер</span>
                        <span>
                          {selectedExtras.reduce((sum, id) => {
                            const extra = paidExtras.find(e => e.id === id);
                            return sum + (extra?.price || 0);
                          }, 0).toLocaleString()} ₸
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-foreground text-xl">
                      <span>Жалпы:</span>
                      <span className="text-primary">
                        {calculateTotalPrice().toLocaleString()} ₸
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut}
                >
                  Брондау
                </Button>

                {(!checkIn || !checkOut) && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted">
                    <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                      Брондау үшін кіру және шығу күндерін таңдаңыз
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
