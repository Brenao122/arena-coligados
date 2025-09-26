// lib/repo.ts
import { appendRows, readRows } from '@/lib/google-sheets';

// Tipos baseados na estrutura real da planilha criada

export type Lead = { 
  id: string; 
  nome: string; 
  telefone?: string; 
  email?: string; 
  origem?: string; 
  interesse?: string;
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
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type Quadra = {
  id: string;
  nome: string;
  tipo: string;
  preco_hora: number;
  capacidade?: number;
  ativa: boolean;
  descricao?: string;
  imagem_url?: string;
  equipamentos?: string;
  created_at?: string;
  updated_at?: string;
};

export type Professor = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  especialidades?: string;
  preco_aula?: number;
  disponibilidade?: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Reserva = {
  id: string;
  nome?: string; // Para compatibilidade com dados existentes
  telefone?: string; // Para compatibilidade com dados existentes
  email?: string; // Para compatibilidade com dados existentes
  data?: string; // Para compatibilidade com dados existentes
  hora?: string; // Para compatibilidade com dados existentes
  servico?: string; // Para compatibilidade com dados existentes
  status?: string;
  quadra_id?: string;
  professor_id?: string;
  valor?: number;
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

export type Usuario = {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  role?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

// ===== LEADS (usando aba leads) =====
export async function getLeads() {
  return readRows<Lead>('leads');
}

export async function addLead(lead: Lead) {
  await appendRows('leads', [lead]);
}

// ===== CLIENTES (usando aba clientes) =====
export async function getClientes() {
  return readRows<Cliente>('clientes');
}

export async function addCliente(cliente: Cliente) {
  await appendRows('clientes', [cliente]);
}

// ===== QUADRAS (usando aba quadras) =====
export async function getQuadras() {
  return readRows<Quadra>('quadras');
}

export async function addQuadra(quadra: Quadra) {
  await appendRows('quadras', [quadra]);
}

// ===== PROFESSORES (usando aba professores) =====
export async function getProfessores() {
  return readRows<Professor>('professores');
}

export async function addProfessor(professor: Professor) {
  await appendRows('professores', [professor]);
}

// ===== RESERVAS (usando aba Página1 - dados existentes) =====
export async function getReservas() {
  return readRows<Reserva>('Página1');
}

export async function addReserva(reserva: Reserva) {
  await appendRows('Página1', [reserva]);
}

// ===== PAGAMENTOS (usando aba pagamentos) =====
export async function getPagamentos() {
  return readRows<Pagamento>('pagamentos');
}

export async function addPagamento(pagamento: Pagamento) {
  await appendRows('pagamentos', [pagamento]);
}

// ===== AVALIAÇÕES (usando aba avaliacoes) =====
export async function getAvaliacoes() {
  return readRows<Avaliacao>('avaliacoes');
}

export async function addAvaliacao(avaliacao: Avaliacao) {
  await appendRows('avaliacoes', [avaliacao]);
}

// ===== USUÁRIOS (usando aba usuarios) =====
export async function getUsuarios() {
  return readRows<Usuario>('usuarios');
}

export async function addUsuario(usuario: Usuario) {
  await appendRows('usuarios', [usuario]);
}
