import { motion } from 'motion/react';
import { Star, Award, Users, TrendingUp, Coffee, UtensilsCrossed, Waves, Sparkles, Trees, Car } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { KazakhBorder } from '../kazakh-ornament';
import { hotelInfo, services } from '../../lib/mock-data';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const iconMap: Record<string, any> = {
  Coffee, UtensilsCrossed, Waves, Sparkles, Trees, Car
};

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Kazakhstan Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl mb-4 text-white" style={{ fontWeight: 700 }}>
              {hotelInfo.nameKz}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              {hotelInfo.descriptionKz}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Бронь жасау
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Толығырақ
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Running Text Marquee */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground py-3 overflow-hidden">
          <div className="marquee whitespace-nowrap">
            <span className="inline-block px-8">
              🎉 Қысқы акция: барлық бөлмелерге 20% жеңілдік! • Жаңа СПА орталығы ашылды • Тегін WiFi барлық бөлмелерде
            </span>
          </div>
        </div>
      </section>

      {/* Hotel Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <Card className="text-center border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-3xl text-foreground mb-1">{hotelInfo.yearsInOperation}+</h3>
                <p className="text-muted-foreground">Жылдық тәжірибе</p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-3xl text-foreground mb-1">{hotelInfo.achievements.length}</h3>
                <p className="text-muted-foreground">Халықаралық сыйлық</p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-3xl text-foreground mb-1">{hotelInfo.totalReviews.toLocaleString()}</h3>
                <p className="text-muted-foreground">Қонақтар пікірі</p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6">
                <Star className="w-12 h-12 mx-auto mb-3 text-primary fill-primary" />
                <h3 className="text-3xl text-foreground mb-1">{hotelInfo.rating}</h3>
                <p className="text-muted-foreground">Орташа рейтинг</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center mb-2 text-foreground">Біздің жетістіктеріміз</h2>
            <KazakhBorder className="mb-8" />

            <div className="grid md:grid-cols-2 gap-4">
              {hotelInfo.achievementsKz.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Award className="w-8 h-8 text-primary flex-shrink-0" />
                      <p className="text-foreground">{achievement}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hotel Services */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center mb-2 text-foreground">Біздің қызметтер</h2>
            <KazakhBorder className="mb-8" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Coffee;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="mb-2 text-foreground">{service.nameKz}</h3>
                        <p className="text-muted-foreground mb-3" style={{ fontSize: '0.875rem' }}>
                          {service.descriptionKz}
                        </p>
                        {service.price > 0 && (
                          <Badge variant="secondary">
                            {service.price.toLocaleString()} ₸
                          </Badge>
                        )}
                        {service.price === 0 && (
                          <Badge variant="outline" className="border-primary text-primary">
                            Тегін
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-2 text-foreground">Фото галерея</h2>
          <KazakhBorder className="mb-8" />

          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 overflow-hidden rounded-xl"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?w=800"
                alt="Hotel Lobby"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </motion.div>

            {[
              'https://images.unsplash.com/photo-1687151621662-94c7c40c6e2c?w=800',
              'https://images.unsplash.com/photo-1757689314932-bec6e9c39e51?w=800',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
              'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-xl h-48"
              >
                <ImageWithFallback
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-2 text-foreground">Байланыс</h2>
          <KazakhBorder className="mb-8" />

          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="p-8 space-y-4">
                <div>
                  <h4 className="text-foreground mb-2">Мекенжай:</h4>
                  <p className="text-muted-foreground">{hotelInfo.addressKz}</p>
                </div>
                <div>
                  <h4 className="text-foreground mb-2">Телефон:</h4>
                  <p className="text-muted-foreground">{hotelInfo.phone}</p>
                </div>
                <div>
                  <h4 className="text-foreground mb-2">Email:</h4>
                  <p className="text-muted-foreground">{hotelInfo.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
