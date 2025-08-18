"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Deal, Stage } from '@/types';
import { mockCompanies, mockContacts, mockDeals, mockProducts } from '@/data/mock-data';
import { KanbanColumn } from './kanban-column';
import { STAGES } from '@/lib/constants';
import { DealForm } from './deal-form';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog';

type DealsByStage = { [key in Stage]: Deal[] };

export function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [companies] = useState(mockCompanies);
  const [contacts] = useState(mockContacts);
  const [products] = useState(mockProducts);
  const [draggingDealId, setDraggingDealId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const handleSave = (dealData: Deal) => {
    if (selectedDeal) {
      setDeals(deals.map(d => d.id === dealData.id ? dealData : d));
    } else {
      setDeals([...deals, { ...dealData, id: `d${Date.now()}` }]);
    }
    setIsFormOpen(false);
    setSelectedDeal(null);
  };

  const handleDelete = () => {
    if (selectedDeal) {
      setDeals(deals.filter(d => d.id !== selectedDeal.id));
      setIsDeleteDialogOpen(false);
      setSelectedDeal(null);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: Stage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    if (!dealId) return;

    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Negócio
        </Button>
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 min-w-max h-full">
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
      {isDeleteDialogOpen && (
        <DeleteConfirmationDialog
            title="Excluir Negócio"
            description={`Tem certeza que deseja excluir o negócio "${selectedDeal?.title}"? Esta ação não pode ser desfeita.`}
            onConfirm={handleDelete}
            onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedDeal(null);
            }}
        />
       )}
    </>
  );
}
