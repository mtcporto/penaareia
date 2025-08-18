
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bot, Mail, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/');
    } catch (error) {
      console.error("Failed to sign in with email", error);
      toast({
        variant: "destructive",
        title: "Erro de Login",
        description: "Credenciais inválidas. Verifique seu e-mail e senha.",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      console.error("Failed to sign in with Google", error);
      toast({
        variant: "destructive",
        title: "Erro de Login com Google",
        description: "Não foi possível autenticar com o Google. Tente novamente.",
      });
       setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <Bot className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl mt-4">Pé na Areia Sales</CardTitle>
          <CardDescription>Bem-vindo! Faça login para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
               <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="email"
                    type="email"
                    placeholder="admin@mail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                />
               </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar com Email'}
            </Button>
          </form>
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-muted-foreground"></div>
            <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Ou</span>
            <div className="flex-grow border-t border-muted-foreground"></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
             <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.84-4.72 1.84-5.6 0-10.2-4.56-10.2-10.2s4.6-10.2 10.2-10.2c3.12 0 5.24 1.28 6.48 2.44l-2.2 2.2c-.92-.88-2.12-1.48-4.28-1.48-3.6 0-6.52 3-6.52 6.6s2.92 6.6 6.52 6.6c4.08 0 5.84-2.84 6.08-4.48h-6.08z"
                ></path>
            </svg>
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
