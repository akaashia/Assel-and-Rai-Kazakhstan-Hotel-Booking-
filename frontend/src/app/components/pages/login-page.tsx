import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';
import { Link, useLocation } from 'wouter';
import { KazakhBorder } from '../kazakh-ornament';

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Барлық өрістерді толтырыңыз');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Сәтті кірдіңіз!');
        setLocation('/');
      } else {
        toast.error('Email немесе құпия сөз дұрыс емес');
      }
    } catch (error) {
      toast.error('Қате орын алды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'client' | 'admin') => {
    setIsLoading(true);
    const demoEmail = role === 'admin' ? 'admin@hotel.kz' : 'user@hotel.kz';
    const success = await login(demoEmail, 'demo123');
    
    if (success) {
      toast.success(role === 'admin' ? 'Әкімші ретінде кірдіңіз' : 'Қолданушы ретінде кірдіңіз');
      setLocation('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 kazakh-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-foreground text-2xl">
              Жүйеге кіру
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Қазақстан қонақ үйіне қош келдіңіз
            </p>
            <KazakhBorder className="mt-4" />
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Құпия сөз
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password">
                  <a className="text-primary hover:underline" style={{ fontSize: '0.875rem' }}>
                    Құпия сөзді ұмыттыңыз ба?
                  </a>
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Кіру...' : 'Кіру'}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                немесе
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-center text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                Demo тіркелгілері:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('client')}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Қолданушы
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Әкімші
                </Button>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                Тіркелгіңіз жоқ па?
              </p>
              <Link href="/register">
                <Button variant="outline" className="w-full">
                  Тіркелу
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
