// teste-conexao-simples.js
// Teste simples para verificar se a planilha está acessível

const { google } = require('googleapis');

async function testarConexao() {
  console.log('🔍 TESTANDO CONEXÃO COM PLANILHA N8N\n');
  console.log('=' .repeat(50));
  
  try {
    // Configuração básica
    const auth = new google.auth.JWT({
      email: 'arenasheets@credencial-n8n-471801.iam.gserviceaccount.com',
      key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBBn5n3Mv31EsF
25qq+WqTMNjW18MPccX2Hp1b/yStceWxKfs899PlDTVdweIkT1DaCpEhInWktm0+
7j7aqEMT9aF/YAC4PA5bAdK4u/uFFL9pVxdPPGPQe+FQ2aDnvJ1WhvI22joDxJ5O
f9+eT/FAnBcD4C/IJjEXJQvKceAAovT1GAOPRleyYGwulibuaOv8NgcXzSCBVUSQ
mBsfHxKMlkqseQY+5GlUbya83v2dW9oG8pT3Up8QBR+hF2akID0C4pVdk7rTZEit
lGhzqp1uXoDfznJBbwPUWhCOVeraLkXQoJPFjallp+yAhYyiHGRvInItD9haItWQ
K1DAxPbxAgMBAAECggEAAscS/asDG8Tx/Pg087ohQAT8PEn98Jb0sWPU7gRwDq2q
I0QN2cnTfYp3HiFZ9jFWnSBRzRdXFbzt/sBL1935h+cTIRiRfcZwsiLfWWdYpHT/
qukCihc0ElkxFwByGndIXsueBjaCBMArkhd1mKKIU3JOCKJl3GUBh9aAVAL+4FwP
CNgtcLkQjWb6tSETsFB8aFHVEfTeRe7bzlzZvZqSxDWB0LESlPHopQRLyZoWWZI+
pB4RQ7/hhKD67yaJeq2v887Ijf+OmMN9gs6jonh89fdnnGJfiDo3iUpEw0O3+hAI
7yPBo3SFVshUE6VT8WeG0j7F5ApIOM65Gkf0jmEwkQKBgQD/mbru1zTLsY5iNbqk
NYPmos774hd9BxGwfhccjK7WuHRVXU62IBV+TRSXQEtCgl9e43xaRzaV1q8i+78E
5Ysnzy09r/iEwpQ0I15O+ikkl/zJAK8iDQcE1yLULnjEgZLE/VTSr+G0hAmd3qp7
aKY2sCDtipPyeJTASoKrRl3fEwKBgQDBU7nsd34y9yziBLFcFzqajepiIbjqzE+i
hkGnyvtzXkpAd+SEcXJxivt1lIpjqlGIskMSWpq7PdYQUmyslfctWiNpbG1yHZwt
5GBIyCbWDT21gbSXvypWEjD/vNywAr3vzUMGCeS0QY1T0VVfvyjxC2o4SDtDVzEv
+kioxRmeawKBgEuYdRAkuCmydvEXAP+GEF/LMTqQEPBageHYOQ+pkCBTZ5zDvv7g
mFrFg1yEmH2wP3K6B1JQE5XXa+8F0+Yn2bNJdBD1laP2RIzzFPZ4yGhZR1tPh3yj
q7rDwjpNEEzWIcl/P3IcsL2J+6oka/mZ5ubvyp1WyhEBlsUUhHcRlbvfAoGAAO9j
vdYSITL635kANp7SJL88+/6Hw3L7i6C0npgnwTYai9dInq9hy1TNxJLUXIkNXejm
1CbmCrPQ3kFXzznmeSyvcSoaGWw1Pi+Vm6SEM5La0o7vDbDaBpKN9B64vo001/0Z
LuVLWufaRCaGEDF/hDL275DB4KCCV2YRhed2KUMCgYEAqdkfL65eas5H0iULBwJe
b//SPZW0okArrWmDUudYErRq/2I+KhAStitT5UfIMpn6dHzRPz/qNL/mVhNrswVR
ocPIHvbmUT1QmZNW58AvH9HAwCEMvDszWs1Auwugc/d6SgUplA5oxRfjw5f/AgjB
8HWaQUjMOB4j9HkaswcHSrA=
-----END PRIVATE KEY-----`,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew';

    console.log(`📊 Testando acesso à planilha: ${spreadsheetId}`);
    
    // Teste 1: Obter informações da planilha
    console.log('\n🔍 Teste 1: Obtendo informações da planilha...');
    const { data: spreadsheet } = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    console.log(`✅ Planilha acessível: "${spreadsheet.properties.title}"`);
    
    // Listar abas
    const abas = spreadsheet.sheets?.map(sheet => sheet.properties.title) || [];
    console.log(`📋 Abas encontradas: ${abas.join(', ')}`);
    
    // Teste 2: Ler dados de uma aba (se existir)
    if (abas.length > 0) {
      const primeiraAba = abas[0];
      console.log(`\n🔍 Teste 2: Lendo dados da aba "${primeiraAba}"...`);
      
      const { data: abaData } = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${primeiraAba}!A1:Z10`,
      });
      
      const rows = abaData.values || [];
      console.log(`✅ Dados lidos: ${rows.length} linhas encontradas`);
      
      if (rows.length > 0) {
        console.log(`📋 Cabeçalhos: ${rows[0].join(' | ')}`);
        if (rows.length > 1) {
          console.log(`📊 Primeira linha de dados: ${rows[1].join(' | ')}`);
        }
      }
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ A planilha está acessível e funcionando');
    console.log('✅ A plataforma pode se conectar ao Google Sheets');
    
  } catch (error) {
    console.log(`\n❌ Erro no teste: ${error.message}`);
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔐 PROBLEMA DE PERMISSÃO:');
      console.log('1. A planilha não está compartilhada com o service account');
      console.log('2. Compartilhe com: arenasheets@credencial-n8n-471801.iam.gserviceaccount.com');
      console.log('3. Dê permissão de "Editor"');
    } else if (error.message.includes('DECODER')) {
      console.log('\n🔑 PROBLEMA DE AUTENTICAÇÃO:');
      console.log('1. Verifique se as credenciais estão corretas');
      console.log('2. Verifique se o service account tem as permissões necessárias');
    } else {
      console.log('\n❓ ERRO DESCONHECIDO:');
      console.log('Verifique os logs para mais detalhes');
    }
  }
}

testarConexao().catch(console.error);
