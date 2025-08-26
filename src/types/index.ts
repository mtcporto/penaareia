
import type { Timestamp } from 'firebase/firestore';

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
    builder?: string;
    size?: number;
    rooms?: string;
    position?: string;
    pricePerSqM?: number;
    location?: string;
    deliveryDate?: string;
    unit?: string;
    floor?: string;
}

export interface Task {
    id: string;
    description: string;
    dueDate?: string | Date | Timestamp;
    completed: boolean;
}

export interface Note {
    id: string;
    content: string;
    createdAt: string | Date | Timestamp;
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
}
