const form = document.querySelector("#resume-form");
const printButton = document.querySelector("#print-button");
const generateProfileButton = document.querySelector("#generate-profile");
const clearFormButton = document.querySelector("#clear-form");
const aiStatus = document.querySelector("#ai-status");
const themeToggle = document.querySelector("#theme-toggle");

const fields = {
  name: document.querySelector("#name"),
  target: document.querySelector("#target"),
  location: document.querySelector("#location"),
  email: document.querySelector("#email"),
  linkedin: document.querySelector("#linkedin"),
  education: document.querySelector("#education"),
  experience: document.querySelector("#experience"),
  skills: document.querySelector("#skills"),
  profile: document.querySelector("#profile")
};

const preview = {
  name: document.querySelector("#preview-name"),
  target: document.querySelector("#preview-target"),
  contact: document.querySelector("#preview-contact"),
  summary: document.querySelector("#preview-summary"),
  experience: document.querySelector("#preview-experience"),
  education: document.querySelector("#preview-education"),
  skills: document.querySelector("#preview-skills")
};

let lastSummaryVariation = -1;

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  if (themeToggle) {
    themeToggle.innerHTML = isDark ? "☾" : "☀";
    themeToggle.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
  }
}

applyTheme(localStorage.getItem("curriculoai-theme") || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("curriculoai-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

const orthographyCorrections = [
  ["nao", "não"],
  ["Nao", "Não"],
  ["voce", "você"],
  ["Voce", "Você"],
  ["ta", "está"],
  ["Ta", "Está"],
  ["ja", "já"],
  ["Ja", "Já"],
  ["oq", "o que"],
  ["Oq", "O que"],
  ["pq", "porque"],
  ["Pq", "Porque"],
  ["pra", "para"],
  ["Pra", "Para"],
  ["tecnologia", "tecnologia"],
  ["ciencia", "ciência"],
  ["Ciencia", "Ciência"],
  ["curriculo", "currículo"],
  ["Curriculo", "Currículo"],
  ["apresentacao", "apresentação"],
  ["Apresentacao", "Apresentação"],
  ["inteligencia", "inteligência"],
  ["Inteligencia", "Inteligência"],
  ["trabalho em equipe", "trabalho em equipe"],
  ["organizacao", "organização"],
  ["Organizacao", "Organização"],
  ["responsavel", "responsável"],
  ["Responsavel", "Responsável"],
  ["qualidade", "qualidade"],
  ["sua experiencia", "sua experiência"],
  ["Sua experiencia", "Sua experiência"],
  ["comunicacao", "comunicação"],
  ["Comunicacao", "Comunicação"],
  ["metas", "metas"],
  ["adaptação", "adaptação"],
  ["adaptacao", "adaptação"],
  ["Adaptacao", "Adaptação"],
  ["proatividade", "proatividade"],
  ["bem sucedido", "bem-sucedido"],
  ["Bem sucedido", "Bem-sucedido"],
  ["esforco", "esforço"],
  ["Esforco", "Esforço"],
  ["resultado", "resultado"],
  ["resultados", "resultados"],
  ["resultados", "resultados"],
  ["ao inves", "em vez"],
  ["Ao inves", "Em vez"],
  ["e-mail", "e-mail"],
  ["email", "e-mail"]
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function autoCorrectText(text) {
  if (!text) return "";

  let corrected = text;

  for (const [wrong, right] of orthographyCorrections) {
    const regex = new RegExp(`\\b${escapeRegex(wrong)}\\b`, "gi");
    corrected = corrected.replace(regex, match => {
      return match.charAt(0) === match.charAt(0).toUpperCase()
        ? right.charAt(0).toUpperCase() + right.slice(1)
        : right;
    });
  }

  corrected = corrected
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])(?=[A-Za-zÀ-ÿ])/g, "$1 ")
    .trim();

  return corrected;
}

function applyAutoCorrection(event) {
  const field = event.target;
  if (!field || !["TEXT", "TEXTAREA"].includes(field.tagName)) return;

  const corrected = autoCorrectText(field.value);
  if (corrected !== field.value) {
    field.value = corrected;
  }
}

function createSummary(name, target, experience, skills) {
  const person = name || "Profissional em desenvolvimento";
  const role = target || "tecnologia";
  const background = experience || "em busca de desenvolver experiencia pratica e novos conhecimentos";
  const abilities = skills || "organizacao, aprendizado continuo e trabalho em equipe";
  const normalizedRole = role.toLowerCase();
  let focus = "resultados consistentes e melhoria continua";

  if (/desenvolvedor|programador|front|back|full.?stack|software|tecnologia|dados/.test(normalizedRole)) {
    focus = "solucoes digitais funcionais, colaborativas e orientadas a resultados";
  } else if (/design|ux|ui|criativ|marketing|conteudo|social media/.test(normalizedRole)) {
    focus = "experiencias relevantes, comunicacao clara e resultados para o publico";
  } else if (/administr|finance|contab|rh|recursos humanos|logistica|vendas|comercial/.test(normalizedRole)) {
    focus = "organizacao de processos, relacionamento profissional e alcance de metas";
  } else if (/suporte|atendimento|help desk|infraestrutura|redes/.test(normalizedRole)) {
    focus = "atendimento cuidadoso, resolucao de problemas e qualidade operacional";
  }

  const variations = [
    `${person} busca atuar como ${role}, contribuindo com ${focus}. Sua experiencia inclui ${background}, aliada a conhecimentos em ${abilities}. E uma pessoa responsavel, adaptavel e comprometida com a evolucao profissional.`,
    `Profissional com objetivo de trabalhar como ${role}, reunindo experiencia em ${background} e conhecimentos em ${abilities}. Tem interesse em desenvolver ${focus} e colaborar com equipes de forma responsavel e proativa.`,
    `Com foco na oportunidade de ${role}, ${person} apresenta vivencia em ${background} e dominio de ${abilities}. Busca transformar essas competencias em ${focus}, mantendo aprendizado continuo e compromisso com bons resultados.`,
    `${person} esta se preparando para novos desafios como ${role}. A partir de sua experiencia em ${background} e de suas competencias em ${abilities}, pretende contribuir para ${focus}, com organizacao, adaptabilidade e vontade de aprender.`
  ];

  let variation = Math.floor(Math.random() * variations.length);
  while (variation === lastSummaryVariation) variation = Math.floor(Math.random() * variations.length);
  lastSummaryVariation = variation;
  return variations[variation];
}

function generateProfile() {
  const summary = createSummary(fields.name.value.trim(), fields.target.value.trim(), fields.experience.value.trim(), fields.skills.value.trim());
  fields.profile.value = summary;
  aiStatus.textContent = "Perfil sugerido. Voce pode editar o texto antes de gerar o curriculo.";
  updatePreview();
}

function updatePreview() {
  const name = fields.name.value.trim();
  const target = fields.target.value.trim();
  const experience = fields.experience.value.trim();
  const education = fields.education.value.trim();
  const skills = fields.skills.value.trim();
  const profile = fields.profile.value.trim();
  const contact = [fields.location.value.trim(), fields.email.value.trim(), fields.linkedin.value.trim()].filter(Boolean);

  preview.name.textContent = name || "Seu nome aparece aqui";
  preview.target.textContent = (target || "Seu objetivo profissional").toUpperCase();
  preview.contact.textContent = contact.join(" | ") || "Preencha seus dados";
  preview.summary.textContent = profile || "Seu perfil profissional sera gerado aqui.";
  preview.experience.textContent = experience || "Adicione sua experiencia para preencher esta secao.";
  preview.education.textContent = education || "Adicione sua formacao academica.";
  preview.skills.innerHTML = skills ? skills.split(",").map(skill => `<span>${skill.trim()}</span>`).join("") : "<span>Suas competencias</span>";
}

Object.values(fields).forEach(field => {
  if (field) {
    field.addEventListener("input", event => {
      applyAutoCorrection(event);
      updatePreview();
    });
  }
});

generateProfileButton.addEventListener("click", generateProfile);
clearFormButton.addEventListener("click", () => {
  const shouldClear = window.confirm("Deseja limpar todos os dados do formulário?");
  if (!shouldClear) return;

  form.reset();
  aiStatus.textContent = "";
  lastSummaryVariation = -1;
  updatePreview();
  fields.name.focus();
});
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!fields.profile.value.trim()) generateProfile();
  updatePreview();
  document.querySelector("#preview").scrollIntoView({ behavior: "smooth", block: "start" });
});
printButton.addEventListener("click", () => window.print());