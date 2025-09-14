// lib/gs-fetch.ts - Utilitário comum para Google Sheets
import { cache } from 'react';

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
}

// Função para normalizar nomes de cabeçalhos
function normalizeHeader(header: string): string {
  return header?.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || '';
}

// Função para mapear linhas da planilha
export function mapSheetRows(values: string[][]): SheetData {
  if (!values?.length) return { headers: [], rows: [] };
  
  const [headers, ...rows] = values;
  const normalizedHeaders = headers.map(normalizeHeader);
  
  return {
    headers,
    rows: rows.map(row => 
      Object.fromEntries(
        normalizedHeaders.map((key, index) => [key, row[index] ?? ''])
      )
    )
  };
}

// Função para buscar dados da planilha
export async function fetchSheet(sheet: string): Promise<string[][]> {
  const base = typeof window === 'undefined' ? '' : '';
  const url = `${base}/api/sheets/read?sheet=${encodeURIComponent(sheet)}`;
  
  const res = await fetch(url, { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error(`Sheets read failed for ${sheet}: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  
  if (!data.ok) {
    throw new Error(`Sheets API error for ${sheet}: ${data.message}`);
  }
  
  return data.values ?? [];
}

// Função cached para buscar e mapear dados
export const fetchSheetData = cache(async (sheet: string): Promise<SheetData> => {
  const values = await fetchSheet(sheet);
  return mapSheetRows(values);
});

// Função para adicionar dados à planilha
export async function appendSheetData(sheet: string, data: (string | number | null)[][]): Promise<any> {
  const base = typeof window === 'undefined' ? '' : '';
  const url = `${base}/api/sheets/append`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet, values: data })
  });
  
  if (!res.ok) {
    throw new Error(`Sheets append failed for ${sheet}: ${res.status} ${res.statusText}`);
  }
  
  const result = await res.json();
  
  if (!result.ok) {
    throw new Error(`Sheets append API error for ${sheet}: ${result.message}`);
  }
  
  return result;
}
