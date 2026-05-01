import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Heart, Star, Users, Maximize, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { rooms as fallbackRooms } from '../../lib/mock-data';
import { getRoomsFromApi } from '../../lib/api';
import { Room } from '../../lib/types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { RoomDetailDialog } from '../room-detail-dialog';

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsApiError, setRoomsApiError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getRoomsFromApi()
      .then((apiRooms) => {
        if (!active) return;
        setRooms(apiRooms);
        setRoomsApiError(null);
      })
      .catch((error) => {
        if (!active) return;
        console.error(error);
        setRooms(fallbackRooms);
        setRoomsApiError('API қосылмады, уақытша mock-data көрсетіліп тұр');
      })
      .finally(() => {
        if (active) setIsLoadingRooms(false);
      });

    return () => {
      active = false;
    };
  }, [rooms]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([20000, 100000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(rooms.map(r => r.category))];
    return cats;
  }, []);

  const filteredRooms = useMemo(() => {
    let filtered = rooms.filter(room => {
      const matchesSearch = room.nameKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
      const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort rooms
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.rating - a.rating;
    });

    return filtered;
  }, [rooms, searchQuery, selectedCategory, priceRange, sortBy]);

  const toggleFavorite = (roomId: string) => {
    const newFavorites = favorites.includes(roomId)
      ? favorites.filter(id => id !== roomId)
      : [...favorites, roomId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const calculateDiscount = (days: number) => {
    if (days >= 7) return 10;
    if (days >= 5) return 4;
    return 0;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-foreground mb-2">Бөлмелер</h1>
          <p className="text-muted-foreground">Өзіңізге қолайлы бөлмені таңдаңыз</p>
        </motion.div>

        <div className="mb-4">
          <Badge variant={roomsApiError ? 'destructive' : 'outline'}>
            {isLoadingRooms ? 'API арқылы бөлмелер жүктеліп жатыр...' : roomsApiError || 'Бөлмелер PostgreSQL API арқылы жүктелді'}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div>
                  <label className="text-foreground mb-2 block">Іздеу</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Бөлме атауы..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-foreground mb-2 block">Категория</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Барлығы</SelectItem>
                      {categories.slice(1).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-foreground mb-2 block">
                    Баға диапазоны
                  </label>
                  <div className="space-y-4">
                    <Slider
                      min={20000}
                      max={100000}
                      step={1000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                      <span>{priceRange[0].toLocaleString()} ₸</span>
                      <span>{priceRange[1].toLocaleString()} ₸</span>
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-foreground mb-2 block">Сұрыптау</label>
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Рейтинг бойынша</SelectItem>
                      <SelectItem value="price-asc">Бағасы арзан</SelectItem>
                      <SelectItem value="price-desc">Бағасы қымбат</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Available Rooms Count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-center text-muted-foreground">
                    <span className="text-primary text-xl">{filteredRooms.length}</span>
                    <br />
                    қолжетімді бөлме
                  </p>
                </div>

                {/* Discount Info */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 space-y-2">
                    <h4 className="text-foreground">Жеңілдіктер:</h4>
                    <ul className="space-y-1 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                      <li>• 5 күн → 4% жеңілдік</li>
                      <li>• 7 күн → 10% жеңілдік</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rooms Grid */}
          <div>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={room.images[0]}
                        alt={room.nameKz}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant={favorites.includes(room.id) ? 'default' : 'secondary'}
                          className="rounded-full w-10 h-10 p-0"
                          onClick={() => toggleFavorite(room.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${favorites.includes(room.id) ? 'fill-current' : ''}`}
                          />
                        </Button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-black/60 text-white border-0">
                          {room.categoryKz}
                        </Badge>
                      </div>
                      {!room.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge variant="destructive">Қолжетімсіз</Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
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

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="w-3 h-3" />
                          {room.floor} қабат
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Users className="w-3 h-3" />
                          {room.maxGuests} адам
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Maximize className="w-3 h-3" />
                          {room.size} м²
                        </Badge>
                      </div>

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
                          Толығырақ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <Card className="p-12 text-center border-primary/20">
                <p className="text-muted-foreground text-xl mb-2">
                  Бөлмелер табылмады
                </p>
                <p className="text-muted-foreground">
                  Іздеу параметрлерін өзгертіп көріңіз
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Room Detail Dialog */}
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
