
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Deal, Stage, Company, Contact, Product } from '@/types';
import { KanbanColumn } from './kanban-column';
import { STAGES } from '@/lib/constants';
import { DealForm } from './deal-form';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog';
import { getDeals, updateDealStage, deleteDeal, addDeal, updateDeal, getCompanies, getContacts, getProducts } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';

type DealsByStage = { [key in Stage]: Deal[] };

export function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [draggingDealId, setDraggingDealId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [dealsData, companiesData, contactsData, productsData] = await Promise.all([
        getDeals(),
        getCompanies(),
        getContacts(),
        getProducts()
    ]);
    setDeals(dealsData);
    setCompanies(companiesData);
    setContacts(contactsData);
    setProducts(productsData);
    setLoading(false);
  }

  const handleSave = async (dealData: Deal) => {
    try {
      if (selectedDeal && selectedDeal.id) {
        await updateDeal(selectedDeal.id, dealData);
        toast({ title: "Sucesso", description: "Negócio atualizado." });
      } else {
        await addDeal(dealData);
        toast({ title: "Sucesso", description: "Negócio criado." });
      }
      fetchData();
      setIsFormOpen(false);
      setSelectedDeal(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar o negócio." });
    }
  };

  const handleDelete = async () => {
    if (selectedDeal && selectedDeal.id) {
        try {
            await deleteDeal(selectedDeal.id);
            toast({ title: "Sucesso", description: "Negócio excluído." });
            fetchData();
            setIsDeleteDialogOpen(false);
            setSelectedDeal(null);
        } catch(error) {
             toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir o negócio." });
        }
    }
  };

  const openForm = (deal: Deal | null = null) => {
    setSelectedDeal(deal);
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDeleteDialogOpen(true);
  }

  const dealsByStage = useMemo<DealsByStage>(() => {
    const initialBoard: DealsByStage = {
      'Sem contato': [],
      'Contato feito': [],
      'Interesse identificado': [],
      'Proposta enviada': [],
      'Fechamento': [],
    };
    deals.forEach(deal => {
      initialBoard[deal.stage].push(deal);
    });
    return initialBoard;
  }, [deals]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
    e.dataTransfer.setData("dealId", dealId);
    setDraggingDealId(dealId);
  };

  const handleDragEnd = () => {
    setDraggingDealId(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStage: Stage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    if (!dealId) return;
    
    const deal = deals.find(d => d.id === dealId);
    if (deal && deal.stage !== newStage) {
        try {
            await updateDealStage(dealId, newStage);
            fetchData();
            toast({ title: "Sucesso", description: `Negócio movido para ${newStage}.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível mover o negócio." });
        }
    }
  };
  
  if (loading) {
      return (
          <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4 shrink-0">
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Negócio
        </Button>
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="inline-grid grid-flow-col auto-cols-max gap-6 h-full pb-4">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={dealsByStage[stage]}
              companies={companies}
              contacts={contacts}
              onDrop={handleDrop}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              draggingDealId={draggingDealId}
              onEdit={openForm}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      </div>
      {isFormOpen && (
        <DealForm
          deal={selectedDeal}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedDeal(null);
          }}
          companies={companies}
          contacts={contacts}
          products={products}
        />
      )}
      {isDeleteDialogOpen && selectedDeal && (
        <DeleteConfirmationDialog
            title="Excluir Negócio"
            description={`Tem certeza que deseja excluir o negócio "${selectedDeal.title}"? Esta ação não pode ser desfeita.`}
            onConfirm={handleDelete}
            onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedDeal(null);
            }}
        />
       )}
    </div>
  );
}
