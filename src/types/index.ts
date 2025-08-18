export type Stage =
  | 'Sem contato'
  | 'Contato feito'
  | 'Interesse identificado'
  | 'Proposta enviada'
  | 'Fechamento';

export interface Company {
  id: string;
  name: string;
}

export interface Contact {
  id: string;
  name: string;
  companyId: string;
}

export interface Deal {
  id: string;
  title: string;
  companyId: string;
  contactId: string;
  value: number;
  stage: Stage;
  contactHistory: string[];
  product: string;
}
