/**
 * Utilitários para trabalhar com Google Sheets
 */

/**
 * Formata corretamente a A1 notation para Google Sheets
 * Envolve o nome da aba em aspas simples se contiver caracteres especiais
 * @param sheetName Nome da aba
 * @param range Range (ex: A1:Z100)
 * @returns Range formatado para A1 notation
 */
export function formatSheetRange(sheetName: string, range: string): string {
  // Se o nome da aba contém caracteres especiais, espaços ou acentos, envolver em aspas simples
  const needsQuotes = /[^a-zA-Z0-9_]/.test(sheetName);
  const quotedSheetName = needsQuotes ? `'${sheetName}'` : sheetName;
  return `${quotedSheetName}!${range}`;
}

/**
 * Converte dados do Google Sheets (array de arrays) em objetos
 * @param values Dados brutos do Google Sheets
 * @returns Array de objetos com as chaves sendo os cabeçalhos
 */
export function convertSheetDataToObjects(values: string[][]): Record<string, any>[] {
  if (!values || values.length === 0) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}
