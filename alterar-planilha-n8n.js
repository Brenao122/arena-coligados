// alterar-planilha-n8n.js
// Script para alterar a planilha para usar a mesma do N8N

const fs = require('fs');

function alterarPlanilha() {
  console.log('🔄 ALTERANDO PLANILHA PARA N8N\n');
  console.log('=' .repeat(50));
  
  // Planilha atual
  const planilhaAtual = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  console.log(`📊 Planilha atual: ${planilhaAtual}`);
  console.log(`🔗 URL atual: https://docs.google.com/spreadsheets/d/${planilhaAtual}/edit`);
  
  console.log('\n💡 Para alterar para a planilha do N8N:');
  console.log('1. Peça para seu sócio o ID da planilha do N8N');
  console.log('2. O ID fica na URL da planilha: https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit');
  console.log('3. Execute: node alterar-planilha-n8n.js [NOVO_ID]');
  
  // Verificar se foi passado um novo ID
  const novoId = process.argv[2];
  
  if (novoId) {
    console.log(`\n🔄 Alterando para nova planilha: ${novoId}`);
    
    // Atualizar variável de ambiente
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = novoId;
    
    // Atualizar .env.local se existir
    try {
      if (fs.existsSync('.env.local')) {
        let envContent = fs.readFileSync('.env.local', 'utf8');
        
        // Substituir ou adicionar a linha
        if (envContent.includes('GOOGLE_SHEETS_SPREADSHEET_ID=')) {
          envContent = envContent.replace(
            /GOOGLE_SHEETS_SPREADSHEET_ID=.*/,
            `GOOGLE_SHEETS_SPREADSHEET_ID=${novoId}`
          );
        } else {
          envContent += `\nGOOGLE_SHEETS_SPREADSHEET_ID=${novoId}\n`;
        }
        
        fs.writeFileSync('.env.local', envContent);
        console.log('✅ Arquivo .env.local atualizado');
      } else {
        // Criar .env.local
        const envContent = `GOOGLE_SERVICE_EMAIL=arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBBn5n3Mv31EsF\n25qq+WqTMNjW18MPccX2Hp1b/yStceWxKfs899PlDTVdweIkT1DaCpEhInWktm0+\n7j7aqEMT9aF/YAC4PA5bAdK4u/uFFL9pVxdPPGPQe+FQ2aDnvJ1WhvI22joDxJ5O\nf9+eT/FAnBcD4C/IJjEXJQvKceAAovT1GAOPRleyYGwulibuaOv8NgcXzSCBVUSQ\nmBsfHxKMlkqseQY+5GlUbya83v2dW9oG8pT3Up8QBR+hF2akID0C4pVdk7rTZEit\nlGhzqp1uXoDfznJBbwPUWhCOVeraLkXQoJPFjallp+yAhYyiHGRvInItD9haItWQ\nK1DAxPbxAgMBAAECggEAAscS/asDG8Tx/Pg087ohQAT8PEn98Jb0sWPU7gRwDq2q\nI0QN2cnTfYp3HiFZ9jFWnSBRzRdXFbzt/sBL1935h+cTIRiRfcZwsiLfWWdYpHT/\nqukCihc0ElkxFwByGndIXsueBjaCBMArkhd1mKKIU3JOCKJl3GUBh9aAVAL+4FwP\nCNgtcLkQjWb6tSETsFB8aFHVEfTeRe7bzlzZvZqSxDWB0LESlPHopQRLyZoWWZI+\npB4RQ7/hhKD67yaJeq2v887Ijf+OmMN9gs6jonh89fdnnGJfiDo3iUpEw0O3+hAI\n7yPBo3SFVshUE6VT8WeG0j7F5ApIOM65Gkf0jmEwkQKBgQD/mbru1zTLsY5iNbqk\nNYPmos774hd9BxGwfhccjK7WuHRVXU62IBV+TRSXQEtCgl9e43xaRzaV1q8i+78E\n5Ysnzy09r/iEwpQ0I15O+ikkl/zJAK8iDQcE1yLULnjEgZLE/VTSr+G0hAmd3qp7\naKY2sCDtipPyeJTASoKrRl3fEwKBgQDBU7nsd34y9yziBLFcFzqajepiIbjqzE+i\nhkGnyvtzXkpAd+SEcXJxivt1lIpjqlGIskMSWpq7PdYQUmyslfctWiNpbG1yHZwt\n5GBIyCbWDT21gbSXvypWEjD/vNywAr3vzUMGCeS0QY1T0VVfvyjxC2o4SDtDVzEv\n+kioxRmeawKBgEuYdRAkuCmydvEXAP+GEF/LMTqQEPBageHYOQ+pkCBTZ5zDvv7g\nmFrFg1yEmH2wP3K6B1JQE5XXa+8F0+Yn2bNJdBD1laP2RIzzFPZ4yGhZR1tPh3yj\nq7rDwjpNEEzWIcl/P3IcsL2J+6oka/mZ5ubvyp1WyhEBlsUUhHcRlbvfAoGAAO9j\nvdYSITL635kANp7SJL88+/6Hw3L7i6C0npgnwTYai9dInq9hy1TNxJLUXIkNXejm\n1CbmCrPQ3kFXzznmeSyvcSoaGWw1Pi+Vm6SEM5La0o7vDbDaBpKN9B64vo001/0Z\nLuVLWufaRCaGEDF/hDL275DB4KCCV2YRhed2KUMCgYEAqdkfL65eas5H0iULBwJe\nb//SPZW0okArrWmDUudYErRq/2I+KhAStitT5UfIMpn6dHzRPz/qNL/mVhNrswVR\nocPIHvbmUT1QmZNW58AvH9HAwCEMvDszWs1Auwugc/d6SgUplA5oxRfjw5f/AgjB\n8HWaQUjMOB4j9HkaswcHSrA=\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=${novoId}`;
        
        fs.writeFileSync('.env.local', envContent);
        console.log('✅ Arquivo .env.local criado');
      }
      
      console.log(`\n🎉 PLANILHA ALTERADA COM SUCESSO!`);
      console.log(`📊 Nova planilha: ${novoId}`);
      console.log(`🔗 Nova URL: https://docs.google.com/spreadsheets/d/${novoId}/edit`);
      console.log('\n⚠️  IMPORTANTE:');
      console.log('1. Certifique-se de que a planilha do N8N tem as abas: leads, clientes, reservas, professores, quadras, avaliacoes');
      console.log('2. Compartilhe a planilha com: arenasheets@credencial-n8n-471801.iam.gserviceaccount.com');
      console.log('3. Execute: npm run dev para testar');
      
    } catch (error) {
      console.error('❌ Erro ao atualizar arquivo:', error.message);
    }
  } else {
    console.log('\n❌ ID da planilha não fornecido!');
    console.log('Uso: node alterar-planilha-n8n.js [ID_DA_PLANILHA_N8N]');
  }
}

alterarPlanilha();
