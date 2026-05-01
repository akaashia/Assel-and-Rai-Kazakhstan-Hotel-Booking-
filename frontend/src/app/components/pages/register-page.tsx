import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';
import { Link, useLocation } from 'wouter';
import { KazakhBorder } from '../kazakh-ornament';

export function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Барлық өрістерді толтырыңыз');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Құпия сөздер сәйкес келмейді');
      return;
    }

    if (password.length < 6) {
      toast.error('Құпия сөз кемінде 6 таңбадан тұруы керек');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Шарттарды қабылдау қажет');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register(email, password, name);
      if (success) {
        toast.success('Тіркелу сәтті өтті!');
        setLocation('/');
      } else {
        toast.error('Тіркелу кезінде қате орын алды');
      }
    } catch (error) {
      toast.error('Қате орын алды');
    } finally {
      setIsLoading(false);
    }
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
              <UserPlus className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-foreground text-2xl">
              Тіркелу
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Жаңа тіркелгі жасаңыз
            </p>
            <KazakhBorder className="mt-4" />
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Аты-жөні
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Толық атыңыз"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  Кемінде 6 таңба
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Құпия сөзді растау
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-muted-foreground cursor-pointer"
                  style={{ fontSize: '0.875rem' }}
                >
                  Мен{' '}
                  <a href="#" className="text-primary hover:underline">
                    пайдалану шарттарымен
                  </a>{' '}
                  және{' '}
                  <a href="#" className="text-primary hover:underline">
                    құпиялылық саясатымен
                  </a>{' '}
                  келісемін
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Тіркелу...' : 'Тіркелу'}
              </Button>
            </form>

            <Separator />

            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                Тіркелгіңіз бар ма?
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Кіру
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
