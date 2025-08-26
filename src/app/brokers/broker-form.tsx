
"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Broker, UserRole } from '@/types';
import { useAuth } from '@/context/auth-context';
import { addBroker, updateBroker } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const brokerSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  email: z.string().email({ message: "Email inválido." }),
  phone: z.string().optional(),
  photoURL: z.string().url({ message: "URL da foto inválida." }).optional().or(z.literal('')),
  role: z.enum(['admin', 'broker'], { required_error: "O papel é obrigatório." }),
  password: z.string().optional(),
});

type BrokerFormValues = z.infer<typeof brokerSchema>;

interface BrokerFormProps {
  broker: Broker | null;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export function BrokerForm({ broker, onSaveSuccess, onCancel }: BrokerFormProps) {
  const { createNewUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BrokerFormValues>({
    resolver: zodResolver(brokerSchema),
    defaultValues: {
      name: broker?.name || '',
      email: broker?.email || '',
      phone: broker?.phone || '',
      photoURL: broker?.photoURL || '',
      role: broker?.role || 'broker',
      password: '',
    },
  });
  
  // Conditionally add password validation only for new brokers
  if (!broker) {
    brokerSchema.extend({
        password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
    });
  }

  const onSubmit = async (data: BrokerFormValues) => {
    setIsLoading(true);
    try {
      if (broker) { // Editing existing broker
        const brokerDataToUpdate: Partial<Omit<Broker, 'id' | 'email'>> = {
            name: data.name,
            phone: data.phone,
            photoURL: data.photoURL,
            role: data.role,
        }
        await updateBroker(broker.id, brokerDataToUpdate);
        toast({ title: "Sucesso", description: "Corretor atualizado." });

      } else { // Creating new broker
        if (!data.password) {
            form.setError("password", { type: "manual", message: "A senha é obrigatória para novos corretores." });
            setIsLoading(false);
            return;
        }
        // 1. Create user in Firebase Auth
        const userCredential = await createNewUser(data.email, data.password);
        const newUserId = userCredential.user.uid;

        // 2. Create broker document in Firestore
        const newBroker: Broker = {
            id: newUserId,
            name: data.name,
            email: data.email,
            role: data.role,
            phone: data.phone,
            photoURL: data.photoURL,
        };
        await addBroker(newBroker);
        toast({ title: "Sucesso", description: "Corretor criado." });
      }
      onSaveSuccess();

    } catch (error: any) {
        console.error("Failed to save broker:", error);
        // Map Firebase Auth error codes to user-friendly messages
        let errorMessage = "Não foi possível salvar o corretor.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Este email já está em uso por outro usuário.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "A senha é muito fraca. Tente uma mais forte.";
        }
        toast({ variant: "destructive", title: "Erro", description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{broker ? 'Editar Corretor' : 'Novo Corretor'}</DialogTitle>
          <DialogDescription>
            {broker ? 'Atualize as informações do corretor.' : 'Preencha as informações para criar um novo corretor e seu login.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do corretor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@corretor.com" {...field} disabled={!!broker} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!broker && (
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(83) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="photoURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Foto</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/foto.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Papel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um papel" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="broker">Corretor</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
