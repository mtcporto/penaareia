export type Stage =
  | 'Sem contato'
  | 'Contato feito'
  | 'Interesse identificado'
  | 'Proposta enviada'
  | 'Fechamento';

export interface Company {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface Contact {
  id: string;
  name: string;
  companyId: string;
  email?: string;
  phone?: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
}

export interface Task {
    id: string;
    description: string;
    dueDate?: string;
    completed: boolean;
}

export interface Note {
    id: string;
    content: string;
    createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  companyId: string;
  contactId: string;
  value: number;
  stage: Stage;
  productId: string;
  contactHistory: string[];
  tasks?: Task[];
  notes?: Note[];
}
