"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockDeals, mockCompanies, mockContacts, mockProducts } from '@/data/mock-data';
import type { Deal, Task, Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Building2, User, Package, DollarSign, Calendar, CheckSquare, FileText, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { STAGE_TITLES } from '@/lib/constants';
import { TaskForm } from './task-form';
import { NoteForm } from './note-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { format } from 'date-fns';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const [itemToDelete, setItemToDelete] = useState<{type: 'task' | 'note', id: string, name: string} | null>(null);

  useEffect(() => {
    const foundDeal = mockDeals.find(d => d.id === dealId);
    if (foundDeal) {
      setDeal(foundDeal);
      setTasks(foundDeal.tasks || []);
      setNotes(foundDeal.notes || []);
    }
  }, [dealId]);

  if (!deal) {
    return <div className="flex items-center justify-center h-full">Negócio não encontrado.</div>;
  }
  
  const company = mockCompanies.find(c => c.id === deal.companyId);
  const contact = mockContacts.find(c => c.id === deal.contactId);
  const product = mockProducts.find(p => p.id === deal.productId);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Task Handlers
  const handleSaveTask = (taskData: Task) => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTasks([...tasks, { ...taskData, id: `t${Date.now()}` }]);
    }
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setItemToDelete(null);
  };
  
  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t));
  }
  
  // Note Handlers
  const handleSaveNote = (noteData: Note) => {
     if (selectedNote) {
      setNotes(notes.map(n => n.id === noteData.id ? noteData : n));
    } else {
      setNotes([...notes, { ...noteData, id: `n${Date.now()}`, createdAt: new Date().toISOString() }]);
    }
    setIsNoteFormOpen(false);
    setSelectedNote(null);
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl">{deal.title}</CardTitle>
                <CardDescription>
                    <Badge variant="secondary">{STAGE_TITLES[deal.stage]}</Badge>
                </CardDescription>
            </div>
            {/* <Button>Editar Negócio</Button> */}
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center text-muted-foreground"><User className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{contact?.name}</span></div>
            <div className="flex items-center text-muted-foreground"><Building2 className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{company?.name}</span></div>
            <div className="flex items-center text-muted-foreground"><Package className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{product?.name}</span></div>
            <div className="flex items-center text-muted-foreground"><DollarSign className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{formatCurrency(deal.value)}</span></div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tasks Section */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-primary"/>
                    <CardTitle>Tarefas</CardTitle>
                </div>
                <Button size="sm" onClick={() => { setSelectedTask(null); setIsTaskFormOpen(true);}}>
                    <PlusCircle className="mr-2"/>
                    Nova Tarefa
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {tasks.length > 0 ? tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                             <Button size="icon" variant={task.completed ? 'default' : 'outline'} className="rounded-full w-8 h-8" onClick={() => handleToggleTask(task.id)}>
                                <CheckSquare className="w-5 h-5"/>
                             </Button>
                            <div>
                                <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.description}</p>
                                {task.dueDate && <p className="text-xs text-muted-foreground"><Calendar className="inline w-3 h-3 mr-1"/>{format(new Date(task.dueDate), "dd/MM/yyyy")}</p>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {setSelectedTask(task); setIsTaskFormOpen(true);}}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setItemToDelete({type: 'task', id: task.id, name: task.description})}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )) : <p className="text-muted-foreground text-center py-4">Nenhuma tarefa adicionada.</p>}
            </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary"/>
                    <CardTitle>Anotações</CardTitle>
                </div>
                <Button size="sm" onClick={() => { setSelectedNote(null); setIsNoteFormOpen(true);}}>
                    <PlusCircle className="mr-2"/>
                    Nova Anotação
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {notes.length > 0 ? notes.map(note => (
                     <div key={note.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                            <p className="font-medium">{note.content}</p>
                            <p className="text-xs text-muted-foreground"><Calendar className="inline w-3 h-3 mr-1"/>{format(new Date(note.createdAt), "dd/MM/yyyy 'às' HH:mm")}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {setSelectedNote(note); setIsNoteFormOpen(true);}}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setItemToDelete({type: 'note', id: note.id, name: `Anotação de ${format(new Date(note.createdAt), "dd/MM/yyyy")}`})}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )) : <p className="text-muted-foreground text-center py-4">Nenhuma anotação adicionada.</p>}
            </CardContent>
        </Card>
      </div>

       {isTaskFormOpen && <TaskForm task={selectedTask} onSave={handleSaveTask} onCancel={() => setIsTaskFormOpen(false)} />}
       {isNoteFormOpen && <NoteForm note={selectedNote} onSave={handleSaveNote} onCancel={() => setIsNoteFormOpen(false)} />}
       {itemToDelete && (
        <DeleteConfirmationDialog
            title={`Excluir ${itemToDelete.type === 'task' ? 'Tarefa' : 'Anotação'}`}
            description={`Tem certeza que deseja excluir "${itemToDelete.name}"? Esta ação não pode ser desfeita.`}
            onConfirm={() => {
                if(itemToDelete.type === 'task') handleDeleteTask(itemToDelete.id)
                else handleDeleteNote(itemToDelete.id)
            }}
            onCancel={() => setItemToDelete(null)}
        />
       )}
    </div>
  );
}
