// Script para corrigir erros de encoding em todo o projeto
const fs = require('fs');
const path = require('path');

// Mapeamento de caracteres mal codificados
const encodingMap = {
  'Ã§': 'ç',
  'Ã£': 'ã', 
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã¢': 'â',
  'Ãª': 'ê',
  'Ã´': 'ô',
  'Ã ': 'à',
  'Ã§': 'ç',
  'Ã£': 'ã',
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã¢': 'â',
  'Ãª': 'ê',
  'Ã´': 'ô',
  'Ã ': 'à',
  'Ã§': 'ç',
  'Ã£': 'ã',
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã¢': 'â',
  'Ãª': 'ê',
  'Ã´': 'ô',
  'Ã ': 'à'
};

function corrigirEncoding(texto) {
  let resultado = texto;
  for (const [errado, correto] of Object.entries(encodingMap)) {
    resultado = resultado.replace(new RegExp(errado, 'g'), correto);
  }
  return resultado;
}

function processarArquivo(caminhoArquivo) {
  try {
    const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
    const conteudoCorrigido = corrigirEncoding(conteudo);
    
    if (conteudo !== conteudoCorrigido) {
      fs.writeFileSync(caminhoArquivo, conteudoCorrigido, 'utf8');
      console.log(`✅ Corrigido: ${caminhoArquivo}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${caminhoArquivo}:`, error.message);
    return false;
  }
}

function processarDiretorio(diretorio) {
  let arquivosCorrigidos = 0;
  
  try {
    const itens = fs.readdirSync(diretorio);
    
    for (const item of itens) {
      const caminhoCompleto = path.join(diretorio, item);
      const stat = fs.statSync(caminhoCompleto);
      
      if (stat.isDirectory()) {
        // Pular node_modules e outros diretórios desnecessários
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
          arquivosCorrigidos += processarDiretorio(caminhoCompleto);
        }
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.jsx'))) {
        if (processarArquivo(caminhoCompleto)) {
          arquivosCorrigidos++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao processar diretório ${diretorio}:`, error.message);
  }
  
  return arquivosCorrigidos;
}

function main() {
  console.log('🔧 Iniciando correção de encoding...');
  
  const diretorios = ['components', 'app'];
  let totalCorrigidos = 0;
  
  for (const dir of diretorios) {
    if (fs.existsSync(dir)) {
      console.log(`\n📁 Processando diretório: ${dir}`);
      totalCorrigidos += processarDiretorio(dir);
    }
  }
  
  console.log(`\n✅ Correção concluída! ${totalCorrigidos} arquivos corrigidos.`);
  
  if (totalCorrigidos > 0) {
    console.log('\n📝 Próximos passos:');
    console.log('1. Verificar se as correções estão corretas');
    console.log('2. Testar o site para garantir que tudo funciona');
    console.log('3. Fazer commit das correções');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { corrigirEncoding, processarArquivo, processarDiretorio };
