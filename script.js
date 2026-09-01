/* ==========================================================================
   Troca de tema
   O padrão é o escuro. Quem clicar no botão troca para o claro, e a escolha
   fica guardada no navegador (localStorage) para a próxima visita.
   ========================================================================== */

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
