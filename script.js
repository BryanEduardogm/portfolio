/* ==========================================================================
   Portfólio — comportamento da página

   Três coisas acontecem aqui:
   1. a troca entre o tema escuro e o claro, guardada no navegador;
   2. a trilha de números na borda direita, que marca o projeto na tela;
   3. o detalhe de cada projeto, que abre no botão "Detalhes".
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. Troca de tema
   O padrão é o escuro. Quem clicar no botão troca para o claro, e a escolha
   fica guardada no navegador (localStorage) para a próxima visita.
   -------------------------------------------------------------------------- */

const CHAVE_TEMA = "portfolio-tema";

const botao = document.getElementById("trocaTema");
const icone = document.getElementById("trocaTemaIcone");
const texto = document.getElementById("trocaTemaTexto");

function temaSalvo() {
  try {
    return localStorage.getItem(CHAVE_TEMA);
  } catch (erro) {
    return null;
  }
}

function aplicarTema(tema) {
  const escuro = tema !== "claro";

  document.documentElement.setAttribute("data-tema", escuro ? "escuro" : "claro");

  // o botão mostra para onde ele leva, não onde você está
  icone.textContent = escuro ? "◐" : "◑";
  texto.textContent = escuro ? "claro" : "escuro";
  botao.setAttribute("aria-pressed", escuro ? "true" : "false");
  botao.setAttribute("aria-label", escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro");
}

botao.addEventListener("click", function () {
  const novo = document.documentElement.getAttribute("data-tema") === "claro" ? "escuro" : "claro";

  try {
    localStorage.setItem(CHAVE_TEMA, novo);
  } catch (erro) {
    console.warn("Não foi possível salvar o tema:", erro);
  }
  aplicarTema(novo);
});

aplicarTema(temaSalvo() || "escuro");


/* --------------------------------------------------------------------------
   2. A trilha acompanha a rolagem

   Existe uma linha imaginária no meio da tela. O projeto marcado é aquele
   que a cruza — na abertura e no fechamento nenhum fica marcado.

   A conta roda uma vez por quadro (requestAnimationFrame), para não pesar
   durante a rolagem.
   -------------------------------------------------------------------------- */

const links = Array.from(document.querySelectorAll(".trilha a"));
const telas = links
  .map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  })
  .filter(Boolean);

function marcarAtiva(tela) {
  links.forEach(function (link) {
    link.classList.toggle("ativo", tela !== null && link.getAttribute("href") === "#" + tela.id);
  });
}

function conferirRolagem() {
  const linha = window.innerHeight * 0.5;
  let atual = null;

  telas.forEach(function (tela) {
    const r = tela.getBoundingClientRect();
    if (r.top <= linha && r.bottom > linha) atual = tela;
  });

  marcarAtiva(atual);
}

if (telas.length) {
  let agendado = false;

  function agendarConferencia() {
    if (agendado) return;
    agendado = true;

    requestAnimationFrame(function () {
      agendado = false;
      conferirRolagem();
    });
  }

  window.addEventListener("scroll", agendarConferencia, { passive: true });
  window.addEventListener("resize", agendarConferencia);
  conferirRolagem();
}


/* --------------------------------------------------------------------------
   3. Detalhe do projeto

   Cada projeto tem um <dialog> no fim do HTML com a descrição completa.
   O botão "Detalhes" carrega o id desse painel em data-abre, e aqui a
   gente só faz a ligação: clicou, abre o painel correspondente.

   O <dialog> nativo já cuida do resto sozinho: escurece o fundo, prende o
   foco lá dentro, fecha no Esc e no botão × (que está num <form
   method="dialog">). O único extra é fechar ao clicar fora, no fundo.
   -------------------------------------------------------------------------- */

document.querySelectorAll("[data-abre]").forEach(function (gatilho) {
  gatilho.addEventListener("click", function () {
    const painel = document.getElementById("detalhe-" + gatilho.dataset.abre);
    if (painel && typeof painel.showModal === "function") painel.showModal();
  });
});

document.querySelectorAll("dialog.detalhe").forEach(function (painel) {
  painel.addEventListener("click", function (evento) {
    // Um clique direto no <dialog> (e não em algo dentro dele) só acontece
    // quando a pessoa clica no fundo escuro, fora do cartão.
    if (evento.target === painel) painel.close();
  });
});
