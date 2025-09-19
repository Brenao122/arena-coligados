// lib/repo.ts
import { appendRow, readSheet } from '@/lib/google-sheets';

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
  return readSheet('leads!A:Z');
}

export async function addLead(lead: Lead) {
  await appendRow('leads!A1', Object.values(lead));
}

// ===== CLIENTES (usando aba clientes) =====
export async function getClientes() {
  return readSheet('clientes!A:Z');
}

export async function addCliente(cliente: Cliente) {
  await appendRow('clientes!A1', Object.values(cliente));
}

// ===== QUADRAS (usando aba quadras) =====
export async function getQuadras() {
  return readSheet('quadras!A:Z');
}

export async function addQuadra(quadra: Quadra) {
  await appendRow('quadras!A1', Object.values(quadra).map(v => v === null || v === undefined ? '' : String(v)));
}

// ===== PROFESSORES (usando aba professores) =====
export async function getProfessores() {
  return readSheet('professores!A:Z');
}

export async function addProfessor(professor: Professor) {
  await appendRow('professores!A1', Object.values(professor).map(v => v === null || v === undefined ? '' : String(v)));
}

// ===== RESERVAS (usando aba Página1 - dados existentes) =====
export async function getReservas() {
  return readSheet('Página1!A:Z');
}

export async function addReserva(reserva: Reserva) {
  await appendRow('Página1!A1', Object.values(reserva).map(v => v === null || v === undefined ? '' : String(v)));
}

// ===== PAGAMENTOS (usando aba pagamentos) =====
export async function getPagamentos() {
  return readSheet('pagamentos!A:Z');
}

export async function addPagamento(pagamento: Pagamento) {
  await appendRow('pagamentos!A1', Object.values(pagamento).map(v => v === null || v === undefined ? '' : String(v)));
}

// ===== AVALIAÇÕES (usando aba avaliacoes) =====
export async function getAvaliacoes() {
  return readSheet('avaliacoes!A:Z');
}

export async function addAvaliacao(avaliacao: Avaliacao) {
  await appendRow('avaliacoes!A1', Object.values(avaliacao).map(v => v === null || v === undefined ? '' : String(v)));
}

// ===== USUÁRIOS (usando aba usuarios) =====
export async function getUsuarios() {
  return readSheet('usuarios!A:Z');
}

export async function addUsuario(usuario: Usuario) {
  await appendRow('usuarios!A1', Object.values(usuario).map(v => v === null || v === undefined ? '' : String(v)));
}
