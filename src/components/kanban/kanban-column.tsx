"use client";

import { useState } from 'react';
import type { Deal, Stage, Company, Contact } from '@/types';
import { KanbanCard } from './kanban-card';
import { STAGE_TITLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  stage: Stage;
  deals: Deal[];
  companies: Company[];
  contacts: Contact[];
  draggingDealId: string | null;
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStage: Stage) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void;
  handleDragEnd: () => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export function KanbanColumn({
  stage,
  deals,
  companies,
  contacts,
  draggingDealId,
  onDrop,
  handleDragStart,
  handleDragEnd,
  onEdit,
  onDelete
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e, stage);
    setIsDragOver(false);
  };

  const getCompanyById = (id: string) => companies.find(c => c.id === id);
  const getContactById = (id: string) => contacts.find(c => c.id === id);

  return (
    <div
      className="flex flex-col w-72 lg:w-80 shrink-0 h-full"
    >
       <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-background z-10">
        <h2 className="font-bold text-lg text-secondary-foreground">{STAGE_TITLES[stage]}</h2>
        <Badge variant="secondary" className="text-sm">{deals.length}</Badge>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex-1 bg-secondary/50 rounded-lg transition-colors duration-300',
          isDragOver && 'bg-accent/20'
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {deals.map(deal => (
              <KanbanCard
                key={deal.id}
                deal={deal}
                company={getCompanyById(deal.companyId)}
                contact={getContactById(deal.contactId)}
                isDragging={draggingDealId === deal.id}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {deals.length === 0 && (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md text-muted-foreground">
                Arraste os cards aqui
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
