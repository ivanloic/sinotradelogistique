# Script pour demarrer le serveur SinoTrade (produits + paiement Moneroo)
Write-Host "Demarrage du serveur SinoTrade..." -ForegroundColor Cyan
Write-Host ""

# Verifier si Node.js est installe
try {
    $nodeVersion = node --version
    Write-Host "Node.js detecte: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: Node.js n'est pas installe. Installez-le depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Aller dans le dossier server
Set-Location -Path "$PSScriptRoot\server"

# Verifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    npm install
    Write-Host "Dependances installees" -ForegroundColor Green
    Write-Host ""
}

# Afficher les endpoints disponibles
Write-Host "Serveur sur http://localhost:3001" -ForegroundColor Cyan
Write-Host "  POST /api/payments/initialize  -> Paiement Moneroo" -ForegroundColor Cyan
Write-Host "  POST /api/products/add         -> Ajout produit" -ForegroundColor Cyan
Write-Host "  GET  /api/health               -> Sante du serveur" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter le serveur" -ForegroundColor Yellow
Write-Host ""

npm start
