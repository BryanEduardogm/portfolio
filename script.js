/* ==========================================================================
   Portfólio — comportamento da página

   Duas coisas acontecem aqui:
   1. a troca entre o tema escuro e o claro, guardada no navegador;
   2. a navegação da esquerda, que marca sozinha o projeto que está na tela.
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
   2. A navegação acompanha a rolagem

   Cada link da esquerda aponta para um projeto. Conforme a pessoa rola, o
   link do projeto que está na tela ganha a classe .ativo — que no CSS pinta
   o texto e acende a barrinha na cor da marca daquele projeto.

   A conta é simples: existe uma linha imaginária a 40% da altura da tela.
   O projeto marcado é o último cujo topo já passou por essa linha. Enquanto
   ninguém passou — ou seja, ainda estamos na apresentação — nada fica marcado.

   A conta só roda uma vez por quadro (requestAnimationFrame), para não pesar
   durante a rolagem.
   -------------------------------------------------------------------------- */

const links = Array.from(document.querySelectorAll(".nav a"));
const blocos = links
  .map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  })
  .filter(Boolean);

const faixaNav = document.querySelector(".nav");
let marcadoAgora = null;

function marcarAtivo(bloco) {
  if (bloco === marcadoAgora) return;
  marcadoAgora = bloco;

  let ativo = null;

  links.forEach(function (link) {
    const eleMesmo = bloco !== null && link.getAttribute("href") === "#" + bloco.id;
    link.classList.toggle("ativo", eleMesmo);
    if (eleMesmo) ativo = link;
  });

  // No celular a lista vira uma fita horizontal estreita: se o item marcado
  // ficou fora da parte visível, a fita anda até ele. No computador a fita
  // não rola, e este trecho não faz nada.
  if (ativo && faixaNav && faixaNav.scrollWidth > faixaNav.clientWidth) {
    const alvo = ativo.offsetLeft - (faixaNav.clientWidth - ativo.offsetWidth) / 2;
    faixaNav.scrollTo({ left: Math.max(0, alvo), behavior: "smooth" });
  }
}

function conferirRolagem() {
  const linha = window.innerHeight * 0.4;
  let atual = null;

  blocos.forEach(function (bloco) {
    if (bloco.getBoundingClientRect().top <= linha) atual = bloco;
  });

  marcarAtivo(atual);
}

if (blocos.length) {
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
