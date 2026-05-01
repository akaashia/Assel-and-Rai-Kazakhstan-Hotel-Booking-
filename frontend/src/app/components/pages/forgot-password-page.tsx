import { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { KazakhBorder } from '../kazakh-ornament';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email мекенжайын енгізіңіз');
      return;
    }

    setIsLoading(true);
    
    // Mock password reset
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast.success('Құпия сөзді қалпына келтіру нұсқаулары жіберілді');
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 kazakh-pattern">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-primary/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-foreground text-2xl">
                Email жіберілді
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Құпия сөзді қалпына келтіру нұсқаулары {email} мекенжайына жіберілді
              </p>
              <KazakhBorder className="mt-4" />
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-muted-foreground text-center" style={{ fontSize: '0.875rem' }}>
                  Email келмеді ме? Спам қалтасын тексеріңіз немесе 60 секундтан кейін қайта жіберіңіз.
                </p>
              </div>

              <Link href="/login">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Кіруге оралу
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              <KeyRound className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-foreground text-2xl">
              Құпия сөзді қалпына келтіру
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Құпия сөзді қалпына келтіру нұсқауларын алу үшін email мекенжайыңызды енгізіңіз
            </p>
            <KazakhBorder className="mt-4" />
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email мекенжайы
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Жіберілуде...' : 'Нұсқауларды жіберу'}
              </Button>
            </form>

            <div className="text-center">
              <Link href="/login">
                <a className="flex items-center justify-center gap-2 text-primary hover:underline">
                  <ArrowLeft className="w-4 h-4" />
                  Кіруге оралу
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
