# Para a Minha Futura

Este projeto é uma página estática pronta para ser publicada no GitHub Pages.

## Como publicar

1. Crie um repositório no GitHub e faça push dos arquivos deste diretório.
2. Certifique-se de que a branch principal seja `main`.
3. O workflow em `.github/workflows/pages.yml` publica automaticamente o site quando você fizer push em `main`.
4. No GitHub, vá em `Settings` > `Pages` e confirme a publicação no branch `main` e na pasta `/root`.

## URL de acesso

Após a publicação, o site ficará disponível em:

`https://<seu-usuario>.github.io/<nome-do-repositorio>/`

Substitua `<seu-usuario>` e `<nome-do-repositorio>` pelos valores do seu GitHub.

## Automação local

Execute `.\\setup.ps1` no PowerShell para:
- inicializar o repositório Git local
- criar um commit
- adicionar o remoto do GitHub
- enviar para `main`

Se o Git não estiver instalado, instale-o antes de executar o script.
