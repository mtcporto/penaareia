
import type { Company, Contact, Deal, Product, Task, Note } from '@/types';
import { Timestamp } from 'firebase/firestore';

export const mockCompanies: Company[] = [
  { id: '1', name: 'Construtora Sol Nascente', email: 'contato@solnascente.com', phone: '(11) 98765-4321', website: 'solnascente.com' },
  { id: '2', name: 'Parceiros Litorâneos', email: 'parceria@litoraneos.com', phone: '(21) 91234-5678', website: 'litoraneos.com' },
  { id: '3', name: 'Imóveis de Luxo SA', email: 'vendas@luxoimoveis.com', phone: '(31) 99999-8888', website: 'luxoimoveis.com' },
  { id: '4', name: 'Urban', email: 'contato@urban.com', phone: '(83) 5555-5555', website: 'urban.com' },
];

export const mockContacts: Contact[] = [
  { id: 'c1', name: 'João Silva', companyId: '1', email: 'joao.silva@solnascente.com', phone: '(11) 98765-1111' },
  { id: 'c2', name: 'Maria Oliveira', companyId: '1', email: 'maria.oliveira@solnascente.com', phone: '(11) 98765-2222' },
  { id: 'c3', name: 'Carlos Pereira', companyId: '2', email: 'carlos.pereira@litoraneos.com', phone: '(21) 91234-3333' },
  { id: 'c4', name: 'Ana Costa', companyId: '3', email: 'ana.costa@luxoimoveis.com', phone: '(31) 99999-4444' },
  { id: 'c5', name: 'Pedro Martins', companyId: '2', email: 'pedro.martins@litoraneos.com', phone: '(21) 91234-5555' },
];

export const mockProducts: Product[] = [
    { 
        id: 'p1', 
        name: 'AKUA', 
        price: 360000, 
        description: 'Apartamento em Bessa.',
        builder: 'Urban',
        size: 24,
        rooms: 'FLAT',
        position: 'SUL',
        pricePerSqM: 15000,
        location: 'BESSA',
        deliveryDate: 'dez./26',
        unit: '1º andar',
        floor: '1º andar'
    },
    { 
        id: 'p2', 
        name: 'Cobertura Duplex', 
        price: 1200000, 
        description: '4 suítes, piscina privativa, 3 vagas de garagem.',
        builder: 'Imóveis de Luxo SA',
        size: 300,
        rooms: '4 suítes',
        position: 'Norte',
        pricePerSqM: 4000,
        location: 'Altiplano',
        deliveryDate: 'Pronto',
        unit: '301',
        floor: '3º'
    },
    { 
        id: 'p3', 
        name: 'Casa Térrea com Piscina', 
        price: 300000, 
        description: '3 quartos, área gourmet com churrasqueira.',
        builder: 'Parceiros Litorâneos',
        size: 150,
        rooms: '3 quartos',
        position: 'Leste',
        pricePerSqM: 2000,
        location: 'Intermares',
        deliveryDate: 'Pronto',
        unit: '123',
        floor: 'Térreo'
    },
];

export const mockDeals: Deal[] = [
  {
    id: 'd1',
    title: 'Venda de Apartamento AKUA',
    companyId: '4',
    contactId: 'c1',
    value: 360000,
    stage: 'Proposta enviada',
    productId: 'p1',
    contactHistory: ['Reunião inicial em 10/05/2024.', 'E-mail com proposta enviado em 15/05/2024.'],
  },
  {
    id: 'd2',
    title: 'Interesse em Cobertura',
    companyId: '3',
    contactId: 'c4',
    value: 1200000,
    stage: 'Interesse identificado',
    productId: 'p2',
    contactHistory: ['Contato via telefone em 12/05/2024.', 'Agendada visita para 20/05/2024.'],
  },
  {
    id: 'd3',
    title: 'Lead de Campanha de Marketing',
    companyId: '2',
    contactId: 'c3',
    value: 300000,
    stage: 'Sem contato',
    productId: 'p3',
    contactHistory: ['Lead recebido via formulário do site em 18/05/2024.'],
  },
];

export const mockTasks: (Omit<Task, 'id' | 'dueDate'> & { dealId: string; id: string; dueDate?: Date})[] = [
    { id: 't1', dealId: 'd1', description: 'Follow-up da proposta', completed: false, dueDate: new Date('2024-06-30') },
    { id: 't2', dealId: 'd1', description: 'Enviar documentação', completed: true, dueDate: new Date('2024-06-25') },
];

export const mockNotes: (Omit<Note, 'id' | 'createdAt'> & { dealId: string; id: string; createdAt: Date})[] = [
    { id: 'n1', dealId: 'd1', content: 'Cliente pareceu muito interessado no acabamento.', createdAt: new Date('2024-06-20T10:30:00') }
];
