param(
    [string]$RemoteUrl = ""
)

function Ensure-Git {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        return
    }

    $candidates = @(
        "$env:ProgramFiles\Git\cmd",
        "$env:ProgramFiles(x86)\Git\cmd",
        "$env:ProgramFiles\Git\bin",
        "$env:ProgramFiles(x86)\Git\bin"
    )

    foreach ($dir in $candidates) {
        if ($dir -and (Test-Path (Join-Path $dir 'git.exe'))) {
            $env:PATH = "$dir;$env:PATH"
            return
        }
    }

    Write-Host "Git não está instalado ou não está no PATH." -ForegroundColor Yellow
    Write-Host "Instale o Git e execute este script novamente."
    exit 1
}

function Ensure-BranchMain {
    $branch = git branch --show-current 2>$null
    if (-not $branch) {
        git checkout -b main
    } elseif ($branch -ne 'main') {
        git branch -M main
    }
}

Ensure-Git

if (-not (Test-Path .git)) {
    git init
}
Ensure-BranchMain

git add .
$commitResult = git commit -m "Publicar no GitHub Pages" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit não foi criado. Talvez já existam commits ou não haja mudanças." -ForegroundColor Yellow
    Write-Host $commitResult
}

if (-not $RemoteUrl) {
    $RemoteUrl = Read-Host "Digite a URL do repositório remoto GitHub (ex: https://github.com/usuario/repositorio.git)"
}

if ($RemoteUrl) {
    $existing = git remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0) {
        git remote remove origin
    }
    git remote add origin $RemoteUrl
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push realizado com sucesso." -ForegroundColor Green
    } else {
        Write-Host "Erro ao enviar para o remoto. Verifique a URL e as credenciais." -ForegroundColor Red
    }
} else {
    Write-Host "Não foi fornecida URL remota. O repositório local foi inicializado." -ForegroundColor Yellow
}
