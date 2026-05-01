import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Heart, Shield, Moon, LogOut, Mail, Phone, Edit2, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';
import { rooms } from '../../lib/mock-data';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    setDarkMode(stored === 'true');

    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }

    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
    toast.success(newMode ? 'Күңгірт режим қосылды' : 'Жарық режим қосылды');
  };

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name, phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success('Профиль сақталды');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Сіз шықтыңыз');
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-foreground mb-2">Кіру қажет</h3>
          <p className="text-muted-foreground mb-6">
            Профильге кіру үшін жүйеге кіріңіз
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Кіру
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-foreground mb-2">Профиль</h1>
          <p className="text-muted-foreground">Жеке ақпаратыңызды басқарыңыз</p>
        </motion.div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3 className="text-foreground mb-1">{user.name}</h3>
                <p className="text-muted-foreground mb-3" style={{ fontSize: '0.875rem' }}>
                  {user.email}
                </p>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'Әкімші' : 'Қолданушы'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">Күңгірт режим</span>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
                </div>
                <Separator />
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Шығу
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Ақпарат</TabsTrigger>
                <TabsTrigger value="bookings">Брондар</TabsTrigger>
                <TabsTrigger value="favorites">Таңдаулар</TabsTrigger>
                <TabsTrigger value="security">Қауіпсіздік</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="info">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-foreground">Жеке ақпарат</span>
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Өңдеу
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                          >
                            Болдырмау
                          </Button>
                          <Button size="sm" onClick={handleSaveProfile}>
                            Сақтау
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Аты-жөні
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Телефон
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        Тіркелген күні: {new Date(user.createdAt).toLocaleDateString('kk-KZ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <History className="w-5 h-5" />
                      Брондау тарихы
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Брондар жоқ</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking, idx) => (
                          <Card key={idx} className="border-primary/20">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="text-foreground mb-1">{booking.roomName}</h4>
                                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                                    {new Date(booking.checkIn).toLocaleDateString('kk-KZ')} - {new Date(booking.checkOut).toLocaleDateString('kk-KZ')}
                                  </p>
                                </div>
                                <Badge variant="secondary">Расталды</Badge>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-border">
                                <span className="text-muted-foreground">Жалпы:</span>
                                <span className="text-primary text-xl">
                                  {booking.totalPrice.toLocaleString()} ₸
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Heart className="w-5 h-5" />
                      Таңдаулар ({favorites.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favorites.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">Таңдаулар жоқ</p>
                        <Button onClick={() => window.location.href = '/favorites'}>
                          Таңдауларға өту
                        </Button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {favorites.slice(0, 4).map(roomId => {
                          const room = rooms.find(r => r.id === roomId);
                          if (!room) return null;
                          return (
                            <Card key={roomId} className="border-primary/20">
                              <CardContent className="p-4">
                                <h4 className="text-foreground mb-2">{room.nameKz}</h4>
                                <p className="text-primary text-xl">
                                  {room.price.toLocaleString()} ₸
                                  <span className="text-muted-foreground text-sm"> / түн</span>
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Shield className="w-5 h-5" />
                      Қауіпсіздік
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-foreground mb-2">Құпия сөзді өзгерту</h4>
                      <div className="space-y-3">
                        <Input type="password" placeholder="Ағымдағы құпия сөз" />
                        <Input type="password" placeholder="Жаңа құпия сөз" />
                        <Input type="password" placeholder="Құпия сөзді қайталаңыз" />
                        <Button>Құпия сөзді өзгерту</Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-foreground mb-2">Екі факторлы аутентификация</h4>
                      <p className="text-muted-foreground mb-3" style={{ fontSize: '0.875rem' }}>
                        Қосымша қауіпсіздік үшін екі факторлы аутентификацияны қосыңыз
                      </p>
                      <Button variant="outline">Қосу</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}