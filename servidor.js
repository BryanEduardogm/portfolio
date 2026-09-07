/* ==========================================================================
   Servidor estatico minimo (sem dependencias) para ver o portfolio localmente.

       node servidor.js      ->  http://localhost:4173

   O site e HTML/CSS/JS puro: da para abrir o index.html com dois cliques.
   Este servidor serve para testar coisas que o navegador bloqueia em file://
   — o principal aqui e o localStorage, que guarda a escolha entre o tema
   claro e o escuro. Em file:// o Chrome as vezes bloqueia, e o site esquece
   a escolha entre uma visita e outra.
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = process.env.PORTA || 4173;
const RAIZ = __dirname;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

http.createServer((req, res) => {
  let caminho = decodeURIComponent(req.url.split('?')[0]);
  if (caminho === '/') caminho = '/index.html';

  const alvo = path.join(RAIZ, path.normalize(caminho));
  // Impede escapar da pasta do projeto com ../
  if (!alvo.startsWith(RAIZ)) {
    res.writeHead(403).end('Acesso negado');
    return;
  }

  fs.readFile(alvo, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Nao encontrei: ' + caminho);
      return;
    }
    const ext = path.extname(alvo).toLowerCase();
    // Servidor de desenvolvimento: NADA vai para o cache. Voce troca um print
    // ou edita o CSS e ve o resultado no F5, sem precisar de Ctrl+F5.
    res.writeHead(200, {
      'Content-Type': TIPOS[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(conteudo);
  });
}).listen(PORTA, () => {
  console.log('Portfolio rodando em http://localhost:' + PORTA);
});
