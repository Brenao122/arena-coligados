const fs = require('fs');
const path = require('path');

// Função para remover console.logs de um arquivo
function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove console.log, console.error, console.warn, console.info
    content = content.replace(/console\.(log|error|warn|info)\s*\([^)]*\);?\s*/g, '');
    
    // Remove console.log com template literals
    content = content.replace(/console\.(log|error|warn|info)\s*\(`[^`]*`\);?\s*/g, '');
    
    // Remove console.log com múltiplos argumentos
    content = content.replace(/console\.(log|error|warn|info)\s*\([^;]*\);?\s*/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Limpo: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erro ao limpar ${filePath}:`, error.message);
  }
}

// Função para processar diretório recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      removeConsoleLogs(filePath);
    }
  });
}

// Processar diretórios principais
const directories = [
  'app',
  'components',
  'hooks',
  'lib',
  'contexts'
];

console.log('🧹 Iniciando limpeza de console.logs...');

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processando: ${dir}`);
    processDirectory(dir);
  }
});

console.log('✅ Limpeza concluída!');
