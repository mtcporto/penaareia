
"use client"

import { useState, useMemo, useEffect } from 'react';
import type { Contact, Company } from '@/types';
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
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { ContactForm } from './contact-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { AppShell } from '@/components/app-shell';
import { getContacts, addContact, updateContact, deleteContact, getCompanies } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [contactsData, companiesData] = await Promise.all([getContacts(), getCompanies()]);
    setContacts(contactsData);
    setCompanies(companiesData);
    setLoading(false);
  }

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'N/A';
  }

  const handleSave = async (contactData: Contact) => {
     try {
      if (selectedContact && selectedContact.id) {
        await updateContact(selectedContact.id, contactData);
        toast({ title: "Sucesso", description: "Contato atualizado." });
      } else {
        await addContact(contactData);
        toast({ title: "Sucesso", description: "Contato criado." });
      }
      fetchData();
      setIsFormOpen(false);
      setSelectedContact(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar o contato." });
    }
  };
  
  const handleDelete = async () => {
    if (selectedContact && selectedContact.id) {
      try {
        await deleteContact(selectedContact.id);
        toast({ title: "Sucesso", description: "Contato excluído." });
        fetchData();
        setIsDeleteDialogOpen(false);
        setSelectedContact(null);
      } catch (error) {
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir o contato." });
      }
    }
  };

  const openForm = (contact: Contact | null = null) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  }

  const filteredContacts = useMemo(() => {
    if (loading || !companies.length) return [];
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompanyName(contact.companyId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, searchTerm, companies, loading]);

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar contato..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Contato
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Carregando...
                    </TableCell>
                </TableRow>
            ) : filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{getCompanyName(contact.companyId)}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openForm(contact)}>
                        <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDeleteDialog(contact)}>
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum contato encontrado.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isFormOpen && (
        <ContactForm
            contact={selectedContact} 
            companies={companies}
            onSave={handleSave}
            onCancel={() => {
                setIsFormOpen(false);
                setSelectedContact(null);
            }}
        />
       )}

       {isDeleteDialogOpen && selectedContact && (
        <DeleteConfirmationDialog
            title="Excluir Contato"
            description={`Tem certeza que deseja excluir o contato "${selectedContact.name}"? Esta ação não pode ser desfeita.`}
            onConfirm={handleDelete}
            onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedContact(null);
            }}
        />
       )}

    </AppShell>
  );
}
