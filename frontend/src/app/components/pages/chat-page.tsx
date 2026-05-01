import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth-context';
import { ScrollArea } from '../ui/scroll-area';
import { askHotelAssistant } from '../../lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Сәлеметсіз бе! Қазақстан қонақ үйіне қош келдіңіз. Мен сізге қалай көмектесе аламын?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = (messageText ?? inputText).trim();
    if (!textToSend || isSending) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsSending(true);

    try {
      const answer = await askHotelAssistant(textToSend);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'AI сервисіне қосылу мүмкін болмады. Backend /api/v1/chat немесе n8n webhook тексеріңіз.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-foreground mb-2">Кіру қажет</h3>
          <p className="text-muted-foreground mb-6">
            Чатты пайдалану үшін жүйеге кіріңіз
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
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-foreground mb-2">Чат қолдауы</h1>
          <p className="text-muted-foreground">24/7 онлайн көмек</p>
        </motion.div>

        <Card className="border-primary/20 h-[calc(100vh-250px)] flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground">Қонақ үй ассистенті</h3>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  Онлайн
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`mt-1 ${
                        message.sender === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                      }`}
                      style={{ fontSize: '0.625rem' }}
                    >
                      {message.timestamp.toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Хабарламаңызды жазыңыз..."
                className="flex-1"
              />
              <Button onClick={() => sendMessage()} disabled={isSending} className="gap-2">
                <Send className="w-4 h-4" />
                {isSending ? 'Жіберілуде...' : 'Жіберу'}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {[
                'Бөлмелер туралы',
                'Бағалар',
                'Қызметтер',
                'Брондау',
                'Мекенжай'
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
