param (
    [string]$CommitMessage = "Update from deploy script"
)

Write-Host "🚀 Iniciando deploy do Seja Livre..." -ForegroundColor Cyan

Write-Host "1. Comitando e enviando para o GitHub..." -ForegroundColor Yellow
git add .
git commit -m $CommitMessage
git push origin main

Write-Host "2. Conectando no servidor remoto (62.238.28.206)..." -ForegroundColor Yellow
$sshCommand = @"
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use default
cd /root/sejalivre || exit
git fetch origin main
git reset --hard origin/main
npm install
npm run build
pm2 restart seja-livre || pm2 start npm --name "seja-livre" -- start
pm2 save
"@

ssh root@62.238.28.206 $sshCommand

Write-Host "✅ Deploy finalizado com sucesso! O sistema está atualizado no servidor." -ForegroundColor Green
