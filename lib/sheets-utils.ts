// lib/sheets-utils.ts - Utilitários para processar dados do Google Sheets

export interface SheetData {
  headers: string[];
  rows: Record<string, any>[];
}

// Função para mapear dados de planilha para objetos
export function mapSheetData(values: string[][]): SheetData {
  if (!values || values.length === 0) {
    return { headers: [], rows: [] };
  }

  const [headers, ...rows] = values;
  
  // Normalizar nomes dos headers
  const normalizedHeaders = headers.map(header => 
    header?.toString().trim().toLowerCase().replace(/\s+/g, '_') || ''
  );

  // Mapear linhas para objetos
  const mappedRows = rows.map(row => {
    const obj: Record<string, any> = {};
    normalizedHeaders.forEach((header, index) => {
      if (header) {
        obj[header] = row[index] || '';
      }
    });
    return obj;
  });

  return {
    headers: headers || [],
    rows: mappedRows
  };
}

// Função para buscar dados específicos
export async function fetchSheetData(sheetName: string): Promise<SheetData> {
  try {
    const response = await fetch(`/api/sheets/read?sheet=${encodeURIComponent(sheetName)}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.message || `Failed to read ${sheetName}`);
    }

    return mapSheetData(data.values);
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    throw error;
  }
}

// Função para adicionar dados à planilha
export async function addSheetData(sheetName: string, values: (string | number | null)[][]) {
  try {
    const response = await fetch('/api/sheets/append', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sheet: sheetName,
        values
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to append to ${sheetName}: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.message || `Failed to append to ${sheetName}`);
    }

    return data;
  } catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    throw error;
  }
}

// Funções específicas para cada tipo de dados
export const sheetsApi = {
  // Reservas
  async getReservas() {
    return fetchSheetData('Reservas');
  },

  // Clientes
  async getClientes() {
    return fetchSheetData('Clientes');
  },

  // Quadras
  async getQuadras() {
    return fetchSheetData('Quadras');
  },

  // Professores
  async getProfessores() {
    return fetchSheetData('Professores');
  },

  // Usuários
  async getUsuarios() {
    return fetchSheetData('Usuarios');
  },

  // Leads
  async getLeads() {
    return fetchSheetData('Leads');
  },

  // Adicionar lead
  async addLead(leadData: {
    nome: string;
    email: string;
    telefone: string;
    interesse: string;
    origem: string;
  }) {
    const values = [[
      new Date().toISOString(),
      leadData.nome,
      leadData.email,
      leadData.telefone,
      leadData.interesse,
      leadData.origem,
      'Novo'
    ]];
    
    return addSheetData('Leads', values);
  }
};
