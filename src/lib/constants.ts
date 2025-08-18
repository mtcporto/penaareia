import type { Stage } from '@/types';

export const STAGES: Stage[] = [
  'Sem contato',
  'Contato feito',
  'Interesse identificado',
  'Proposta enviada',
  'Fechamento',
];

export const STAGE_TITLES: Record<Stage, string> = {
  'Sem contato': 'Sem Contato',
  'Contato feito': 'Contato Feito',
  'Interesse identificado': 'Interesse Identificado',
  'Proposta enviada': 'Proposta Enviada',
  'Fechamento': 'Fechamento',
};
