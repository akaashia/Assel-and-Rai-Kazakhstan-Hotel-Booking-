import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { rooms } from '../../lib/mock-data';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { RoomDetailDialog } from '../room-detail-dialog';
import { Room } from '../../lib/types';
import { toast } from 'sonner';

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const favoriteRooms = useMemo(() => {
    return rooms.filter(room => favorites.includes(room.id));
  }, [favorites]);

  const removeFavorite = (roomId: string) => {
    const newFavorites = favorites.filter(id => id !== roomId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    toast.success('Таңдаулардан өшірілді');
  };

  const toggleFavorite = (roomId: string) => {
    if (favorites.includes(roomId)) {
      removeFavorite(roomId);
    } else {
      const newFavorites = [...favorites, roomId];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      toast.success('Таңдауларға қосылды');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-foreground">Таңдаулар</h1>
          </div>
          <p className="text-muted-foreground">
            Сіздің ұнатқан бөлмелеріңіз ({favoriteRooms.length})
          </p>
        </motion.div>

        {favoriteRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="p-12 text-center border-primary/20">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-foreground mb-2">Таңдаулар бос</h3>
              <p className="text-muted-foreground mb-6">
                Ұнатқан бөлмелеріңізді осы жерге қо��ыңыз
              </p>
              <Button onClick={() => window.location.href = '/rooms'}>
                Бөлмелерді қарау
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group">
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={room.images[0]}
                      alt={room.nameKz}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => removeFavorite(room.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/60 text-white border-0">
                        {room.categoryKz}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-foreground">{room.nameKz}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-foreground">{room.rating}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2" style={{ fontSize: '0.875rem' }}>
                      {room.descriptionKz}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                          Түнге
                        </p>
                        <p className="text-primary text-xl">
                          {room.price.toLocaleString()} ₸
                        </p>
                      </div>
                      <Button
                        onClick={() => setSelectedRoom(room)}
                        className="gap-2"
                      >
                        Брондау
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedRoom && (
        <RoomDetailDialog
          room={selectedRoom}
          open={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onToggleFavorite={toggleFavorite}
          isFavorite={favorites.includes(selectedRoom.id)}
        />
      )}
    </div>
  );
}
