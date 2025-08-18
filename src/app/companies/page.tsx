"use client"

import { useState, useMemo } from 'react';
import { mockCompanies } from '@/data/mock-data';
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
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { CompanyForm } from './company-form';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = (companyData: Company) => {
    if (selectedCompany) {
      setCompanies(companies.map(c => c.id === companyData.id ? companyData : c));
    } else {
      setCompanies([...companies, { ...companyData, id: `c${Date.now()}` }]);
    }
    setIsFormOpen(false);
    setSelectedCompany(null);
  };

  const handleDelete = () => {
    if (selectedCompany) {
      setCompanies(companies.filter(c => c.id !== selectedCompany.id));
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    }
  };

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
    <div>
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
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Nova Empresa
        </Button>
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
            {filteredCompanies.map(company => (
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
            ))}
             {filteredCompanies.length === 0 && (
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

       {isDeleteDialogOpen && (
        <DeleteConfirmationDialog
            title="Excluir Empresa"
            description={`Tem certeza que deseja excluir a empresa "${selectedCompany?.name}"? Esta ação não pode ser desfeita.`}
            onConfirm={handleDelete}
            onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCompany(null);
            }}
        />
       )}

    </div>
  );
}
