# Site da Dakura Motos

Site em React (Vite) da Dakura Motos, oficina e loja de motos em Ouro Preto.

## Publicar na Cloudflare Pages a partir deste repositório
Workers & Pages > Create > Pages > Connect to Git > escolha este repositório e use:
- Framework preset: Vite (ou React (Vite))
- Build command: `npm run build`
- Build output directory: `dist`

Cada alteração enviada para o GitHub publica o site de novo automaticamente.

## Mudar textos, telefone ou horário
Quase tudo fica em `src/data.js`. As fotos ficam em `src/assets/`.

## Rodar no computador
Com o Node.js instalado: `npm install` e depois `npm run dev`.
