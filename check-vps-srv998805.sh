#!/bin/bash

# =============================================
# SCRIPT PARA VERIFICAR VPS SRV998805
# =============================================
# Execute este script na VPS para verificar configurações

echo "🔍 VERIFICANDO VPS SRV998805 - ARENA COLIGADOS"
echo "=============================================="
echo "Domínio: srv998805.hstgr.cloud"
echo "IP: 31.97.72.137"
echo ""

# 1. Verificar IP público
echo "📡 IP Público da VPS:"
curl -s ifconfig.me
echo ""

# 2. Verificar se a API está rodando
echo "🚀 Status da API:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/sheets/read?sheet=Reservas
echo ""

# 3. Verificar containers Docker (se existirem)
echo "🐳 Containers Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Docker não encontrado"

# 4. Verificar processos Node.js
echo "📦 Processos Node.js:"
ps aux | grep node | grep -v grep || echo "Nenhum processo Node.js encontrado"

# 5. Verificar arquivos de configuração
echo "📁 Arquivos de configuração encontrados:"
find /srv /root /home -name "*.env" -o -name "config.env" 2>/dev/null | head -5

# 6. Verificar credenciais Google (sem mostrar conteúdo)
echo "🔑 Arquivos de credenciais Google:"
find /root /srv /home -name "*credencial*" -o -name "*service*account*" 2>/dev/null | head -3

# 7. Verificar logs da aplicação
echo "📋 Logs recentes da aplicação:"
tail -n 5 /var/log/arena/*.log 2>/dev/null || echo "Logs não encontrados"

# 8. Verificar Nginx
echo "🌐 Status do Nginx:"
systemctl status nginx --no-pager -l 2>/dev/null || echo "Nginx não encontrado"

# 9. Verificar portas em uso
echo "🔌 Portas em uso:"
netstat -tlnp | grep -E ":(80|443|3000)" || echo "Portas não encontradas"

# 10. Verificar firewall
echo "🔥 Status do Firewall:"
ufw status 2>/dev/null || iptables -L 2>/dev/null || echo "Firewall não configurado"

echo ""
echo "✅ Verificação concluída!"
echo "💡 Use os comandos abaixo para obter informações específicas:"
echo "   - cat /srv/arena-coligados/.env (para ver variáveis de ambiente)"
echo "   - docker logs nome_do_container (para ver logs do container)"
echo "   - systemctl status arena-coligados (para ver status do serviço)"
echo "   - pm2 status (para ver status do PM2)"
echo ""
echo "🌐 URLs para testar:"
echo "   - http://localhost:3000/api/sheets/read?sheet=Reservas"
echo "   - http://srv998805.hstgr.cloud/api/sheets/read?sheet=Reservas"
echo "   - http://31.97.72.137/api/sheets/read?sheet=Reservas"
