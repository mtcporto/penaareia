
"use client"

import { useState, useMemo, useEffect } from 'react';
import type { Company } from '@/types';
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
import { PlusCircle, Search, Edit, Trash2, Database } from 'lucide-react';
import { CompanyForm } from './company-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { AppShell } from '@/components/app-shell';
import { getCompanies, addCompany, updateCompany, deleteCompany, seedDatabase } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const companiesData = await getCompanies();
    setCompanies(companiesData);
    setLoading(false);
  }

  const handleSave = async (companyData: Company) => {
    try {
      if (selectedCompany && selectedCompany.id) {
        await updateCompany(selectedCompany.id, companyData);
        toast({ title: "Sucesso", description: "Empresa atualizada." });
      } else {
        await addCompany(companyData);
        toast({ title: "Sucesso", description: "Empresa criada." });
      }
      fetchCompanies();
      setIsFormOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar a empresa." });
    }
  };

  const handleDelete = async () => {
    if (selectedCompany && selectedCompany.id) {
        try {
            await deleteCompany(selectedCompany.id);
            toast({ title: "Sucesso", description: "Empresa excluída." });
            fetchCompanies();
            setIsDeleteDialogOpen(false);
            setSelectedCompany(null);
        } catch(error) {
             toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir a empresa." });
        }
    }
  };

  const handleSeed = async () => {
    try {
      await seedDatabase();
      toast({ title: "Sucesso", description: "Banco de dados populado com dados iniciais." });
      fetchCompanies();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível popular o banco de dados." });
    }
  }

  const openForm = (company: Company | null = null) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  }

  const filteredCompanies = useMemo(() => {
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar empresa..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
         <div className="flex gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={handleSeed}>
                <Database className="mr-2 h-5 w-5" />
                Popular Dados
              </Button>
            )}
            <Button onClick={() => openForm()}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Nova Empresa
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
              <TableHead>Website</TableHead>
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
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {company.website}
                      </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openForm(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDeleteDialog(company)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    Nenhuma empresa encontrada.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {isFormOpen && (
        <CompanyForm 
            company={selectedCompany} 
            onSave={handleSave}
            onCancel={() => {
                setIsFormOpen(false);
                setSelectedCompany(null);
            }}
        />
       )}

       {isDeleteDialogOpen && selectedCompany && (
        <DeleteConfirmationDialog
            title="Excluir Empresa"
            description={`Tem certeza que deseja excluir a empresa "${selectedCompany.name}"? Esta ação não pode ser desfeita.`}
            onConfirm={handleDelete}
            onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCompany(null);
            }}
        />
       )}

    </AppShell>
  );
}
