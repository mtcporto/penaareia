
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Deal, Task, Note, Company, Contact, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Building2, User, Package, DollarSign, Calendar, CheckSquare, FileText, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { STAGE_TITLES } from '@/lib/constants';
import { TaskForm } from './task-form';
import { NoteForm } from './note-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { format } from 'date-fns';
import { AppShell } from '@/components/app-shell';
import { getDeal, getCompany, getContact, getProduct, getTasks, addTask, updateTask, deleteTask, getNotes, addNote, updateNote, deleteNote } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import type { Timestamp } from 'firebase/firestore';


export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const dealId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const [itemToDelete, setItemToDelete] = useState<{type: 'task' | 'note', id: string, name: string} | null>(null);

  const fetchDealData = useCallback(async () => {
    setLoading(true);
    const foundDeal = await getDeal(dealId);
    if (foundDeal) {
      setDeal(foundDeal);
      const [companyData, contactData, productData, tasksData, notesData] = await Promise.all([
        getCompany(foundDeal.companyId),
        getContact(foundDeal.contactId),
        getProduct(foundDeal.productId),
        getTasks(dealId),
        getNotes(dealId),
      ]);
      setCompany(companyData);
      setContact(contactData);
      setProduct(productData);
      setTasks(tasksData);
      setNotes(notesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    setLoading(false);
  }, [dealId]);

  useEffect(() => {
    fetchDealData();
  }, [fetchDealData]);

  if (loading) {
     return (
        <AppShell>
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        </AppShell>
    );
  }

  if (!deal) {
    return <AppShell><div className="flex items-center justify-center h-full">Negócio não encontrado.</div></AppShell>;
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (date: string | Date | Timestamp) => {
    if(!date) return '';
    const dateObj = (date as Timestamp).toDate ? (date as Timestamp).toDate() : new Date(date);
    return format(dateObj, "dd/MM/yyyy");
  }
  const formatDateTime = (date: string | Date | Timestamp) => {
    if(!date) return '';
    const dateObj = (date as Timestamp).toDate ? (date as Timestamp).toDate() : new Date(date);
    return format(dateObj, "dd/MM/yyyy 'às' HH:mm");
  }

  // Task Handlers
  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      if (selectedTask && selectedTask.id) {
        await updateTask(dealId, selectedTask.id, taskData);
        toast({ title: "Sucesso", description: "Tarefa atualizada." });
      } else {
        await addTask(dealId, taskData);
        toast({ title: "Sucesso", description: "Tarefa adicionada." });
      }
      fetchDealData();
      setIsTaskFormOpen(false);
      setSelectedTask(null);
    } catch(e) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar a tarefa." });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
        await deleteTask(dealId, taskId);
        toast({ title: "Sucesso", description: "Tarefa excluída." });
        fetchDealData();
        setItemToDelete(null);
    } catch(e) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir a tarefa." });
    }
  };
  
  const handleToggleTask = async (task: Task) => {
    try {
        await updateTask(dealId, task.id, { ...task, completed: !task.completed });
        fetchDealData();
    } catch(e) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar a tarefa." });
    }
  }
  
  // Note Handlers
  const handleSaveNote = async (noteData: Omit<Note, 'id'>) => {
     try {
        if (selectedNote && selectedNote.id) {
            await updateNote(dealId, selectedNote.id, noteData);
            toast({ title: "Sucesso", description: "Anotação atualizada." });
        } else {
            await addNote(dealId, noteData);
            toast({ title: "Sucesso", description: "Anotação adicionada." });
        }
        fetchDealData();
        setIsNoteFormOpen(false);
        setSelectedNote(null);
    } catch(e) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar a anotação." });
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
        await deleteNote(dealId, noteId);
        toast({ title: "Sucesso", description: "Anotação excluída." });
        fetchDealData();
        setItemToDelete(null);
    } catch(e) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir a anotação." });
    }
  };

  return (
    <AppShell>
      <Button variant="outline" onClick={() => router.push('/')} className="mb-4">
        <ArrowLeft className="mr-2" />
        Voltar para o Kanban
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
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center text-muted-foreground"><User className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{contact?.name}</span></div>
            <div className="flex items-center text-muted-foreground"><Building2 className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{company?.name}</span></div>
            <div className="flex items-center text-muted-foreground"><Package className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{product?.name}</span></div>
            <div className="flex items-center text-muted-foreground"><DollarSign className="w-5 h-5 mr-3 shrink-0 text-primary" /> <span>{formatCurrency(deal.value)}</span></div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
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
                             <Button size="icon" variant={task.completed ? 'default' : 'outline'} className="rounded-full w-8 h-8" onClick={() => handleToggleTask(task)}>
                                <CheckSquare className="w-5 h-5"/>
                             </Button>
                            <div>
                                <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.description}</p>
                                {task.dueDate && <p className="text-xs text-muted-foreground"><Calendar className="inline w-3 h-3 mr-1"/>{formatDate(task.dueDate)}</p>}
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
                            <p className="text-xs text-muted-foreground"><Calendar className="inline w-3 h-3 mr-1"/>{formatDateTime(note.createdAt)}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {setSelectedNote(note); setIsNoteFormOpen(true);}}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setItemToDelete({type: 'note', id: note.id, name: `Anotação de ${formatDateTime(note.createdAt)}`})}>
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
    </AppShell>
  );
}
