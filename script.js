/* =========================================================
   CONFIGURAÇÃO — ALTERE AQUI OS NÚMEROS DE WHATSAPP
   Use o formato internacional, somente números:
   55 (Brasil) + DDD + número.  Ex.: 5511999998888
   ========================================================= */
const CONFIG = {
  // Número que recebe as INSCRIÇÕES (botão "Faça sua inscrição" e formulário)
  WHATSAPP_INSCRICAO: "5591993355470",

  // Número de CONTATO (botão flutuante, card de contato, rodapé)
  WHATSAPP_CONTATO: "5591993355470",

  // Mensagem inicial ao clicar nos botões de contato
  MSG_CONTATO: "Olá! Vim pelo site do Workshop Marcelo Nunes e gostaria de mais informações.",
};

/* =========================================================
   HELPERS
   ========================================================= */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const linkWhats = (numero, texto) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

/* =========================================================
   ANO ATUAL NO RODAPÉ
   ========================================================= */
$("#ano").textContent = new Date().getFullYear();

/* =========================================================
   HEADER — efeito ao rolar
   ========================================================= */
const header = $("#header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll);
onScroll();

/* =========================================================
   MENU MOBILE
   ========================================================= */
const navToggle = $("#navToggle");
const nav = $("#nav");
navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  navToggle.classList.toggle("active");
});
// Fecha o menu ao clicar em um link
$$(".nav__link, .nav__cta", nav).forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.classList.remove("active");
  })
);

/* =========================================================
   BOTÕES DE WHATSAPP GENÉRICOS (data-whatsapp)
   ========================================================= */
$$('[data-whatsapp]').forEach((el) => {
  const tipo = el.getAttribute("data-whatsapp");
  if (el.id === "formInscricao") return; // o form tem tratamento próprio
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (tipo === "inscricao") {
      // Rola até o formulário de inscrição
      $("#inscricao").scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(linkWhats(CONFIG.WHATSAPP_CONTATO, CONFIG.MSG_CONTATO), "_blank");
    }
  });
});

/* =========================================================
   MÁSCARAS (CPF e Telefone)
   ========================================================= */
const mascaraCPF = (v) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const mascaraTelefone = (v) => {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (v.length > 6)  return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  if (v.length > 2)  return v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  return v.replace(/(\d{0,2})/, "($1");
};

const cpf = $("#cpf");
const tel = $("#telefone");
cpf.addEventListener("input", (e) => (e.target.value = mascaraCPF(e.target.value)));
tel.addEventListener("input", (e) => (e.target.value = mascaraTelefone(e.target.value)));

/* =========================================================
   FORMULÁRIO DE INSCRIÇÃO -> WHATSAPP
   ========================================================= */
const form = $("#formInscricao");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const dados = {
    "Nome completo":      $("#nome").value.trim(),
    "Endereço":           $("#endereco").value.trim(),
    "CPF":                $("#cpf").value.trim(),
    "RG":                 $("#rg").value.trim(),
    "Data de nascimento": formatarData($("#nascimento").value),
    "Telefone/WhatsApp":  $("#telefone").value.trim(),
    "E-mail":             $("#email").value.trim(),
  };

  let texto = "*NOVA INSCRIÇÃO — Workshop Marcelo Nunes*\n\n";
  for (const [rotulo, valor] of Object.entries(dados)) {
    if (!valor) continue; // pula campos vazios (ex.: CPF/RG não preenchidos)
    texto += `*${rotulo}:* ${valor}\n`;
  }
  texto += "\nGostaria de confirmar minha inscrição e realizar o pagamento do valor do kit. 🧶";

  window.open(linkWhats(CONFIG.WHATSAPP_INSCRICAO, texto), "_blank");
});

function formatarData(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/* =========================================================
   ANIMAÇÕES AO ROLAR (reveal)
   ========================================================= */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  observer.observe(el);
});
