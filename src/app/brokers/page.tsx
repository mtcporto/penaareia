
"use client"

import { useState, useMemo, useEffect } from 'react';
import type { Broker } from '@/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Edit, Trash2, ShieldCheck, User } from 'lucide-react';
import { BrokerForm } from './broker-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { AppShell } from '@/components/app-shell';
import { getBrokers, deleteBroker } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchBrokers();
    }
  }, [isAdmin]);

  const fetchBrokers = async () => {
    setLoading(true);
    const brokersData = await getBrokers();
    setBrokers(brokersData);
    setLoading(false);
  }

  // The handleSave will be called from the form now
  const handleSaveSuccess = () => {
    fetchBrokers();
    setIsFormOpen(false);
    setSelectedBroker(null);
  }

  const handleDelete = async () => {
    if (selectedBroker && selectedBroker.id) {
        try {
            // Note: This only deletes from Firestore. Deleting from Firebase Auth
            // requires a backend function for security reasons.
            await deleteBroker(selectedBroker.id);
            toast({ title: "Sucesso", description: "Corretor excluído do Firestore." });
            fetchBrokers();
            setIsDeleteDialogOpen(false);
            setSelectedBroker(null);
        } catch(error) {
             toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir o corretor." });
        }
    }
  };

  const openForm = (broker: Broker | null = null) => {
    setSelectedBroker(broker);
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (broker: Broker) => {
    setSelectedBroker(broker);
    setIsDeleteDialogOpen(true);
  }

  const filteredBrokers = useMemo(() => {
    return brokers.filter(broker =>
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brokers, searchTerm]);

  if (!isAdmin) {
    return (
        <AppShell>
            <div className="text-center">
                <h1 className="text-2xl font-bold">Acesso Negado</h1>
                <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
            </div>
        </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
         <div className="flex gap-2">
            <Button onClick={() => openForm()}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Novo Corretor
            </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Carregando corretores...
                    </TableCell>
                </TableRow>
            ) : filteredBrokers.length > 0 ? (
              filteredBrokers.map(broker => (
                <TableRow key={broker.id}>
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-3">
                      <Image
                        src={broker.photoURL || `https://placehold.co/40x40.png`}
                        alt={broker.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint="broker avatar"
                      />
                      <span>{broker.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{broker.email}</TableCell>
                  <TableCell>{broker.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={broker.role === 'admin' ? 'default' : 'secondary'}>
                      {broker.role === 'admin' ? <ShieldCheck className="mr-1 h-4 w-4"/> : <User className="mr-1 h-4 w-4"/>}
                      <span className="capitalize">{broker.role}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openForm(broker)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDeleteDialog(broker)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum corretor encontrado.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {isFormOpen && (
        <BrokerForm 
            broker={selectedBroker} 
            onSaveSuccess={handleSaveSuccess}
            onCancel={() => {
                setIsFormOpen(false);
                setSelectedBroker(null);
            }}
        />
       )}

       {isDeleteDialogOpen && selectedBroker && (
        <DeleteConfirmationDialog
            title="Excluir Corretor"
            description={`Tem certeza que deseja excluir o corretor "${selectedBroker.name}"? Esta ação removerá o registro do Firestore, mas não excluirá o usuário do sistema de autenticação. A exclusão de autenticação deve ser feita manualmente ou através de uma função de backend.`}
            onConfirm={handleDelete}
            onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedBroker(null);
            }}
        />
       )}

    </AppShell>
  );
}
