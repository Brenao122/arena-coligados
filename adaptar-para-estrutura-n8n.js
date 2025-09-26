// adaptar-para-estrutura-n8n.js
// Script para adaptar a plataforma para a estrutura da planilha N8N

const { google } = require('googleapis');

async function adaptarEstrutura() {
  console.log('🔧 ADAPTANDO PLATAFORMA PARA ESTRUTURA N8N\n');
  console.log('=' .repeat(60));
  
  try {
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

    // Ler dados atuais
    const { data: abaData } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Página1!A1:Z100',
    });
    
    const rows = abaData.values || [];
    console.log(`📊 Dados encontrados: ${rows.length} linhas`);
    
    if (rows.length > 0) {
      const headers = rows[0];
      console.log(`📋 Cabeçalhos atuais: ${headers.join(' | ')}`);
      
      // Mapear para estrutura da plataforma
      console.log('\n🔄 MAPEAMENTO DE CAMPOS:');
      console.log('-'.repeat(40));
      
      const mapeamento = {
        'Nome': 'nome',
        'Telefone': 'telefone', 
        'Email': 'email',
        'Data': 'data_inicio',
        'Hora': 'hora_inicio',
        'Serviço': 'tipo',
        'Status': 'status'
      };
      
      for (const [campoN8N, campoPlataforma] of Object.entries(mapeamento)) {
        if (headers.includes(campoN8N)) {
          console.log(`✅ ${campoN8N} → ${campoPlataforma}`);
        } else {
          console.log(`❌ ${campoN8N} → ${campoPlataforma} (não encontrado)`);
        }
      }
      
      // Mostrar dados existentes
      if (rows.length > 1) {
        console.log('\n📊 DADOS EXISTENTES:');
        console.log('-'.repeat(40));
        rows.slice(1, 6).forEach((row, index) => {
          const dados = row.map((cell, i) => `${headers[i]}: ${cell || 'vazio'}`).join(' | ');
          console.log(`${index + 1}: ${dados}`);
        });
        if (rows.length > 6) {
          console.log(`... e mais ${rows.length - 6} registros`);
        }
      }
    }
    
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('1. A plataforma será adaptada para usar a aba "Página1"');
    console.log('2. Os campos serão mapeados conforme a estrutura N8N');
    console.log('3. Execute: npm run dev para testar');
    
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }
}

adaptarEstrutura().catch(console.error);
