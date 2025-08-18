
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Contact, Company } from '@/types';

const contactSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  companyId: z.string().min(1, { message: "A empresa é obrigatória." }),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  phone: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contact: Contact | null;
  companies: Company[];
  onSave: (contactData: Contact) => void;
  onCancel: () => void;
}

export function ContactForm({ contact, companies, onSave, onCancel }: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || '',
      companyId: contact?.companyId || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    onSave({ ...data, id: contact?.id || '' });
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
          <DialogDescription>
            {contact ? 'Atualize as informações do contato.' : 'Preencha as informações do novo contato.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma empresa" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
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
                    <Input placeholder="contato@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
