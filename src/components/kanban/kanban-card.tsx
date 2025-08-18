"use client";

import { useState } from 'react';
import type { Deal, Company, Contact, Product } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Building2, User, Package, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { AIAssistantModal } from './ai-assistant-modal';
import { cn } from '@/lib/utils';
import { mockProducts } from '@/data/mock-data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface KanbanCardProps {
  deal: Deal;
  company?: Company;
  contact?: Contact;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void;
  handleDragEnd: () => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export function KanbanCard({ deal, company, contact, isDragging, handleDragStart, handleDragEnd, onEdit, onDelete }: KanbanCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const product = mockProducts.find(p => p.id === deal.productId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => handleDragStart(e, deal.id)}
        onDragEnd={handleDragEnd}
        className={cn(
          "cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border-l-4 border-primary",
          isDragging && "opacity-50 scale-95 rotate-3 shadow-xl"
        )}
      >
        <CardHeader className="pb-2 flex-row items-start justify-between">
          <CardTitle className="text-base font-bold text-card-foreground leading-tight">{deal.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(deal)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(deal)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-2 text-sm pt-0 pb-4">
          <div className="flex items-center text-muted-foreground">
            <User className="w-4 h-4 mr-2 shrink-0" />
            <span>{contact?.name || 'Contato não encontrado'}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Building2 className="w-4 h-4 mr-2 shrink-0" />
            <span>{company?.name || 'Empresa não encontrada'}</span>
          </div>
           <div className="flex items-center text-muted-foreground">
            <Package className="w-4 h-4 mr-2 shrink-0" />
            <span>{product?.name || 'Produto não encontrado'}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant="secondary" className="text-base font-semibold">
            {formatCurrency(deal.value)}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="text-accent-foreground/70 hover:text-accent-foreground hover:bg-accent/30 rounded-full"
            onClick={() => setIsModalOpen(true)}
            aria-label="Sugestão de IA"
          >
            <Lightbulb className="w-5 h-5 text-primary" />
          </Button>
        </CardFooter>
      </Card>
      {isModalOpen && (
        <AIAssistantModal
          deal={deal}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
}
