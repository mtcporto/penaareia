
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import type { Timestamp } from 'firebase/firestore';

const taskSchema = z.object({
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
  dueDate: z.date().optional(),
  completed: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task: Task | null;
  onSave: (taskData: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const getDateFromTimestamp = (date: Task['dueDate']): Date | undefined => {
    if (!date) return undefined;
    if ((date as Timestamp).toDate) {
        return (date as Timestamp).toDate();
    }
    return new Date(date as string | Date);
}

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: task?.description || '',
      dueDate: getDateFromTimestamp(task?.dueDate),
      completed: task?.completed || false,
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    onSave(data);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
          <DialogDescription>
            {task ? 'Atualize as informações da tarefa.' : 'Preencha as informações da nova tarefa.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ligar para o cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Vencimento</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                            ) : (
                                <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        Concluída
                        </FormLabel>
                    </div>
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
