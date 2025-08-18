"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Deal, Stage } from '@/types';
import { mockCompanies, mockContacts, mockDeals } from '@/data/mock-data';
import { KanbanColumn } from './kanban-column';
import { STAGES } from '@/lib/constants';

type DealsByStage = { [key in Stage]: Deal[] };

export function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies] = useState(mockCompanies);
  const [contacts] = useState(mockContacts);
  const [draggingDealId, setDraggingDealId] = useState<string | null>(null);

  useEffect(() => {
    setDeals(mockDeals);
  }, []);

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
    <div className="flex-1 overflow-x-auto p-4 lg:p-6">
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
          />
        ))}
      </div>
    </div>
  );
}
