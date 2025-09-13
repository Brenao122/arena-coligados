// lib/repo.ts
import { appendRows, readRows } from '@/lib/google-sheets';

export type Lead = { 
  id: string; 
  nome: string; 
  telefone?: string; 
  email?: string; 
  origem?: string; 
  status?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Cliente = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  data_nascimento?: string;
  created_at?: string;
  updated_at?: string;
};

export type Quadra = {
  id: string;
  nome: string;
  tipo: string;
  preco_hora: number;
  status: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
};

export type Professor = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  especialidade?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export type Reserva = {
  id: string;
  cliente_id: string;
  quadra_id: string;
  professor_id?: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;
  status: string;
  valor_total: number;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Pagamento = {
  id: string;
  reserva_id: string;
  valor: number;
  metodo: string;
  status: string;
  data_pagamento?: string;
  created_at?: string;
  updated_at?: string;
};

export type Avaliacao = {
  id: string;
  cliente_id: string;
  professor_id?: string;
  reserva_id?: string;
  nota: number;
  comentario?: string;
  created_at?: string;
  updated_at?: string;
};

// ===== LEADS (usando aba Página1 da planilha N8N) =====
export async function getLeads() {
  return readRows<Lead>('Página1');
}

export async function addLead(lead: Lead) {
  await appendRows('Página1', [lead]);
}

// ===== CLIENTES (usando aba Página1 da planilha N8N) =====
export async function getClientes() {
  return readRows<Cliente>('Página1');
}

export async function addCliente(cliente: Cliente) {
  await appendRows('Página1', [cliente]);
}

// ===== QUADRAS =====
export async function getQuadras() {
  return readRows<Quadra>('quadras');
}

export async function addQuadra(quadra: Quadra) {
  await appendRows('quadras', [quadra]);
}

// ===== PROFESSORES =====
export async function getProfessores() {
  return readRows<Professor>('professores');
}

export async function addProfessor(professor: Professor) {
  await appendRows('professores', [professor]);
}

// ===== RESERVAS (usando aba Página1 da planilha N8N) =====
export async function getReservas() {
  return readRows<Reserva>('Página1');
}

export async function addReserva(reserva: Reserva) {
  await appendRows('Página1', [reserva]);
}

// ===== PAGAMENTOS =====
export async function getPagamentos() {
  return readRows<Pagamento>('pagamentos');
}

export async function addPagamento(pagamento: Pagamento) {
  await appendRows('pagamentos', [pagamento]);
}

// ===== AVALIAÇÕES =====
export async function getAvaliacoes() {
  return readRows<Avaliacao>('avaliacoes');
}

export async function addAvaliacao(avaliacao: Avaliacao) {
  await appendRows('avaliacoes', [avaliacao]);
}
