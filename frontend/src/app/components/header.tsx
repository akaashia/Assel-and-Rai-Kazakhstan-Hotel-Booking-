import { Link, useLocation } from 'wouter';
import { Home, Bed, Heart, User, MessageCircle, LogIn, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../lib/auth-context';
import { useState, useEffect } from 'react';
import { KazakhOrnament } from './kazakh-ornament';

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'kz' | 'en'>('kz');

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) {
      setDarkMode(stored === 'true');
      document.documentElement.classList.toggle('dark', stored === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const navItems = [
    { path: '/', icon: Home, labelKz: 'Басты бет', labelEn: 'Home' },
    { path: '/rooms', icon: Bed, labelKz: 'Бөлмелер', labelEn: 'Rooms' },
    { path: '/favorites', icon: Heart, labelKz: 'Таңдаулар', labelEn: 'Favorites' },
    { path: '/profile', icon: User, labelKz: 'Профиль', labelEn: 'Profile' },
    { path: '/chat', icon: MessageCircle, labelKz: 'Чат', labelEn: 'Chat' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-lg bg-opacity-95 transition-all duration-300">
      <div className="container mx-auto px-4">
        {/* Top bar with logo and actions */}
        <div className="flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transform transition-transform group-hover:scale-105">
                <span className="text-primary-foreground">КГҚ</span>
              </div>
              <div>
                <h1 className="text-foreground group-hover:text-primary transition-colors">
                  {language === 'kz' ? 'Қазақстан' : 'Kazakhstan'}
                </h1>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  {language === 'kz' ? 'Гранд Қонақ үйі' : 'Grand Hotel'}
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'kz' ? 'en' : 'kz')}
              className="hover:bg-primary/10"
            >
              {language.toUpperCase()}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="hover:bg-primary/10"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="default" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  {language === 'kz' ? 'Кіру' : 'Login'}
                </Button>
              </Link>
            )}
            {isAuthenticated && user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                <User className="w-4 h-4 text-primary" />
                <span className="text-foreground">{user.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            const label = language === 'kz' ? item.labelKz : item.labelEn;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-primary/10 text-foreground'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Ornamental border */}
      <KazakhOrnament className="w-full h-2 text-primary opacity-20" />
    </header>
  );
}