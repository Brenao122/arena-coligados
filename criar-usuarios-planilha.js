// criar-usuarios-planilha.js
// Script para criar usuários na planilha N8N

const { google } = require('googleapis');

async function criarUsuarios() {
  console.log('🔐 CRIANDO USUÁRIOS NA PLANILHA N8N\n');
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

    console.log(`📊 Acessando planilha: ${spreadsheetId}`);
    
    // Verificar se a aba "usuarios" existe
    const { data: spreadsheet } = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    const abas = spreadsheet.sheets?.map(sheet => sheet.properties.title) || [];
    console.log(`📋 Abas existentes: ${abas.join(', ')}`);
    
    // Criar aba "usuarios" se não existir
    if (!abas.includes('usuarios')) {
      console.log('\n🔧 Criando aba "usuarios"...');
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'usuarios'
              }
            }
          }]
        }
      });
      
      console.log('✅ Aba "usuarios" criada com sucesso!');
    }
    
    // Adicionar cabeçalhos na aba usuarios
    console.log('\n📝 Adicionando cabeçalhos...');
    
    const headers = [
      ['id', 'email', 'senha', 'nome', 'telefone', 'role', 'ativo', 'criado_em']
    ];
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'usuarios!A1:H1',
      valueInputOption: 'RAW',
      requestBody: {
        values: headers
      }
    });
    
    console.log('✅ Cabeçalhos adicionados!');
    
    // Criar usuários padrão
    console.log('\n👥 Criando usuários padrão...');
    
    const usuarios = [
      {
        id: 'admin-001',
        email: 'admin@arena.com',
        senha: 'admin123',
        nome: 'Administrador Arena',
        telefone: '(11) 99999-9999',
        role: 'admin',
        ativo: 'SIM',
        criado_em: new Date().toISOString()
      },
      {
        id: 'prof-001',
        email: 'professor@arena.com',
        senha: 'prof123',
        nome: 'Professor Arena',
        telefone: '(11) 88888-8888',
        role: 'professor',
        ativo: 'SIM',
        criado_em: new Date().toISOString()
      },
      {
        id: 'cliente-001',
        email: 'cliente@arena.com',
        senha: 'cliente123',
        nome: 'Cliente Arena',
        telefone: '(11) 77777-7777',
        role: 'cliente',
        ativo: 'SIM',
        criado_em: new Date().toISOString()
      }
    ];
    
    const valoresUsuarios = usuarios.map(user => [
      user.id,
      user.email,
      user.senha,
      user.nome,
      user.telefone,
      user.role,
      user.ativo,
      user.criado_em
    ]);
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'usuarios!A2:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: valoresUsuarios
      }
    });
    
    console.log('✅ Usuários criados com sucesso!');
    
    // Listar usuários criados
    console.log('\n📋 USUÁRIOS CRIADOS:');
    console.log('=' .repeat(50));
    
    usuarios.forEach(user => {
      console.log(`👤 ${user.nome}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Senha: ${user.senha}`);
      console.log(`   🎭 Role: ${user.role}`);
      console.log('');
    });
    
    console.log('🎉 USUÁRIOS CRIADOS COM SUCESSO!');
    console.log('✅ Agora você pode fazer login na plataforma');
    console.log('✅ Use qualquer um dos usuários acima');
    
  } catch (error) {
    console.log(`\n❌ Erro: ${error.message}`);
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔐 PROBLEMA DE PERMISSÃO:');
      console.log('1. A planilha não está compartilhada com o service account');
      console.log('2. Compartilhe com: arenasheets@credencial-n8n-471801.iam.gserviceaccount.com');
      console.log('3. Dê permissão de "Editor"');
    }
  }
}

criarUsuarios().catch(console.error);
