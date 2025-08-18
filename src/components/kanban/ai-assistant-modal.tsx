"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { suggestNextAction, type SuggestNextActionOutput } from '@/ai/flows/suggest-next-action';
import type { Deal } from '@/types';
import { Lightbulb, AlertTriangle, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mock-data';

interface AIAssistantModalProps {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIAssistantModal({ deal, open, onOpenChange }: AIAssistantModalProps) {
  const [suggestion, setSuggestion] = useState<SuggestNextActionOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const product = mockProducts.find(p => p.id === deal.productId);

  useEffect(() => {
    if (open) {
      const getSuggestion = async () => {
        setLoading(true);
        setError(null);
        setSuggestion(null);
        try {
          const input = {
            stage: deal.stage,
            contactHistory: deal.contactHistory.join('\\n'),
            dealDetails: `Produto: ${product?.name}. Valor: ${deal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Título: ${deal.title}`,
          };
          const result = await suggestNextAction(input);
          setSuggestion(result);
        } catch (e) {
          console.error("AI suggestion failed:", e);
          const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido.";
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "Erro na Sugestão de IA",
            description: "Não foi possível obter a sugestão. Tente novamente mais tarde.",
          });
        } finally {
          setLoading(false);
        }
      };
      getSuggestion();
    }
  }, [open, deal, toast, product]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="text-primary w-6 h-6" />
            Assistente de Vendas IA
          </DialogTitle>
          <DialogDescription>
            Sugestão de próximo passo para a negociação: "{deal.title}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Não foi possível carregar a sugestão. Por favor, tente novamente.
              </AlertDescription>
            </Alert>
          )}
          {suggestion && (
            <div className="space-y-4 animate-in fade-in duration-500">
               <div className="p-4 bg-secondary/50 rounded-lg">
                 <h3 className="font-semibold flex items-center gap-2 mb-2 text-secondary-foreground">
                   <Target className="w-5 h-5 text-accent" />
                   Próxima Ação Sugerida
                 </h3>
                 <p className="text-muted-foreground">{suggestion.nextAction}</p>
               </div>
               <div className="p-4 bg-secondary/50 rounded-lg">
                 <h3 className="font-semibold flex items-center gap-2 mb-2 text-secondary-foreground">
                   <Calendar className="w-5 h-5 text-accent" />
                   Timing Ideal
                 </h3>
                 <p className="text-muted-foreground">{suggestion.timing}</p>
               </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
