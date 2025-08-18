
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
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Note } from '@/types';

const noteSchema = z.object({
  content: z.string().min(1, { message: "O conteúdo não pode estar vazio." }),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface NoteFormProps {
  note: Note | null;
  onSave: (noteData: Omit<Note, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: note?.content || '',
    },
  });

  const onSubmit = (data: NoteFormValues) => {
    onSave(data);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? 'Editar Anotação' : 'Nova Anotação'}</DialogTitle>
          <DialogDescription>
            {note ? 'Atualize o conteúdo da anotação.' : 'Adicione uma nova anotação à negociação.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Digite sua anotação aqui..." {...field} rows={5}/>
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
