import type { Company, Contact, Deal } from '@/types';

export const mockCompanies: Company[] = [
  { id: '1', name: 'Construtora Sol Nascente' },
  { id: '2', name: 'Parceiros Litorâneos' },
  { id: '3', name: 'Imóveis de Luxo SA' },
];

export const mockContacts: Contact[] = [
  { id: 'c1', name: 'João Silva', companyId: '1' },
  { id: 'c2', name: 'Maria Oliveira', companyId: '1' },
  { id: 'c3', name: 'Carlos Pereira', companyId: '2' },
  { id: 'c4', name: 'Ana Costa', companyId: '3' },
  { id: 'c5', name: 'Pedro Martins', companyId: '2' },
];

export const mockDeals: Deal[] = [
  {
    id: 'd1',
    title: 'Venda de Apartamento 2 Quartos',
    companyId: '1',
    contactId: 'c1',
    value: 450000,
    stage: 'Proposta enviada',
    contactHistory: ['Reunião inicial em 10/05/2024.', 'E-mail com proposta enviado em 15/05/2024.'],
    product: 'Apartamento Vista Mar'
  },
  {
    id: 'd2',
    title: 'Interesse em Cobertura',
    companyId: '3',
    contactId: 'c4',
    value: 1200000,
    stage: 'Interesse identificado',
    contactHistory: ['Contato via telefone em 12/05/2024.', 'Agendada visita para 20/05/2024.'],
    product: 'Cobertura Duplex'
  },
  {
    id: 'd3',
    title: 'Lead de Campanha de Marketing',
    companyId: '2',
    contactId: 'c3',
    value: 300000,
    stage: 'Sem contato',
    contactHistory: ['Lead recebido via formulário do site em 18/05/2024.'],
    product: 'Casa Térrea com Piscina'
  },
  {
    id: 'd4',
    title: 'Cliente Indicado',
    companyId: '1',
    contactId: 'c2',
    value: 750000,
    stage: 'Contato feito',
    contactHistory: ['Primeiro contato por e-mail em 17/05/2024.'],
    product: 'Apartamento 3 Suítes'
  },
  {
    id: 'd5',
    title: 'Negociação Contrato de Aluguel',
    companyId: '2',
    contactId: 'c5',
    value: 5000,
    stage: 'Fechamento',
    contactHistory: ['Contrato assinado em 01/05/2024.'],
    product: 'Aluguel Temporada'
  }
];
