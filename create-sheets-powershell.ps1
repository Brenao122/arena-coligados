# create-sheets-powershell.ps1
# Script PowerShell para criar planilha Google Sheets

Write-Host "=== CRIANDO PLANILHA GOOGLE SHEETS ===" -ForegroundColor Green

# Configurações
$GOOGLE_SERVICE_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"
$GOOGLE_PRIVATE_KEY = @"
-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----
"@

Write-Host "Configurações carregadas!" -ForegroundColor Yellow
Write-Host "Service Email: $GOOGLE_SERVICE_EMAIL" -ForegroundColor Cyan
Write-Host "Private Key: [OCULTA POR SEGURANÇA]" -ForegroundColor Cyan

Write-Host "`n=== EXECUTANDO NODE SCRIPT ===" -ForegroundColor Green

# Definir variáveis de ambiente temporariamente
$env:GOOGLE_SERVICE_EMAIL = $GOOGLE_SERVICE_EMAIL
$env:GOOGLE_PRIVATE_KEY = $GOOGLE_PRIVATE_KEY

# Executar o script Node.js
node scripts/create-sheets.js

Write-Host "`n=== SCRIPT CONCLUÍDO ===" -ForegroundColor Green
Write-Host "Verifique o output acima para o link da planilha!" -ForegroundColor Yellow
