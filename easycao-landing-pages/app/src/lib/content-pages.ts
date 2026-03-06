// Content page registry — single source of truth for nav, footer, sitemap,
// related pages, breadcrumbs, and metadata across the entire site.

export interface ContentPage {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  keywords: string[];
  updatedAt: string;
  readingTime: number;
  relatedSlugs: string[];
  category: "understand" | "prepare" | "logistics";
  phase: number;
}

export const CONTENT_PAGES: ContentPage[] = [
  // ── "Entenda a Prova ICAO" (5) — understand → prepare → act journey ──
  {
    slug: "como-funciona-a-prova-icao",
    title: "Como Funciona a Prova ICAO: Guia Completo [2026]",
    seoTitle: "Como Funciona a Prova ICAO | Easycao",
    description:
      "Saiba como funciona a prova ICAO: as 4 partes, duração, como é avaliada e o que esperar no dia. Guia completo por examinador ICAO credenciado.",
    keywords: [
      "como funciona a prova icao",
      "prova icao 4 partes",
      "prova icao quanto tempo dura",
      "prova icao online",
    ],
    updatedAt: "2026-03-03",
    readingTime: 10,
    relatedSlugs: [
      "descritores-da-prova-icao",
      "niveis-icao",
      "como-se-preparar-para-a-prova-icao",
      "sdea-santos-dumont-english-assessment",
    ],
    category: "understand",
    phase: 1,
  },
  {
    slug: "descritores-da-prova-icao",
    title: "Os 6 Descritores da Prova ICAO: Como Você é Avaliado",
    seoTitle: "Descritores da Prova ICAO | Easycao",
    description:
      "Entenda os 6 descritores da prova ICAO: Pronunciation, Structure, Vocabulary, Fluency, Comprehension e Interaction. Saiba como cada um é avaliado.",
    keywords: [
      "descritores da prova icao",
      "descritores icao",
      "descritores holísticos icao",
      "como sou avaliado prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 12,
    relatedSlugs: [
      "niveis-icao",
      "erros-comuns-prova-icao",
      "vocabulario-aviacao-ingles",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "understand",
    phase: 1,
  },
  {
    slug: "niveis-icao",
    title: "Níveis ICAO: Entenda a Escala de 1 a 6",
    seoTitle: "Níveis ICAO (1 a 6) Explicados | Easycao",
    description:
      "Entenda os níveis ICAO de 1 a 6: o que cada nível significa, validade, como é calculado e qual nível as companhias aéreas exigem. Guia completo.",
    keywords: [
      "níveis icao",
      "icao nível 4",
      "icao nível 5 validade",
      "icao nível 6",
      "nota mínima prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 9,
    relatedSlugs: [
      "descritores-da-prova-icao",
      "validade-e-renovacao-prova-icao",
      "resultado-prova-icao",
    ],
    category: "understand",
    phase: 1,
  },
  {
    slug: "sdea-santos-dumont-english-assessment",
    title: "SDEA — Santos Dumont English Assessment: O que é e Como Funciona",
    seoTitle: "SDEA Santos Dumont English Assessment | Easycao",
    description:
      "Entenda o que é o SDEA (Santos Dumont English Assessment), nome oficial da prova ICAO no Brasil. Saiba como funciona, quem aplica e mudanças recentes.",
    keywords: [
      "SDEA",
      "Santos Dumont English Assessment",
      "SDEA prova",
      "credenciamento SDEA",
    ],
    updatedAt: "2026-03-03",
    readingTime: 7,
    relatedSlugs: [
      "como-funciona-a-prova-icao",
      "onde-fazer-a-prova-icao",
      "quem-precisa-fazer-prova-icao",
    ],
    category: "understand",
    phase: 3,
  },
  {
    slug: "quem-precisa-fazer-prova-icao",
    title: "Quem Precisa Fazer a Prova ICAO? Requisitos por Licença",
    seoTitle: "Quem Precisa Fazer a Prova ICAO | Easycao",
    description:
      "Descubra quem precisa fazer a prova ICAO: requisitos por tipo de licença (PP, PC, PLA), exceções automáticas e se voos domésticos exigem.",
    keywords: [
      "quem precisa fazer prova icao",
      "prova icao obrigatória",
      "icao para piloto privado",
      "icao para comissários",
    ],
    updatedAt: "2026-03-03",
    readingTime: 6,
    relatedSlugs: [
      "como-funciona-a-prova-icao",
      "prova-icao-helicoptero",
      "como-agendar-a-prova-icao",
    ],
    category: "understand",
    phase: 3,
  },

  // ── "Prepare-se para a Prova" (6) ─────────────────────────────────────
  {
    slug: "como-se-preparar-para-a-prova-icao",
    title: "Como se Preparar para a Prova ICAO: Guia Prático",
    seoTitle: "Como se Preparar para a Prova ICAO | Easycao",
    description:
      "Guia prático de preparação para a prova ICAO. Evite os 3 erros mais comuns, saiba o que estudar e quanto tempo leva. Método recomendado por examinador.",
    keywords: [
      "como estudar para prova icao",
      "como passar na prova icao",
      "preparação prova icao",
      "dicas prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 10,
    relatedSlugs: [
      "quanto-tempo-preparar-prova-icao",
      "erros-comuns-prova-icao",
      "simulado-prova-icao",
      "descritores-da-prova-icao",
    ],
    category: "prepare",
    phase: 1,
  },
  {
    slug: "quanto-tempo-preparar-prova-icao",
    title: "Quanto Tempo Leva para se Preparar para a Prova ICAO?",
    seoTitle: "Quanto Tempo para Preparar para Prova ICAO | Easycao",
    description:
      "Descubra quanto tempo leva para se preparar para a prova ICAO, com timelines por nível de inglês e plano de estudo semanal recomendado.",
    keywords: [
      "quanto tempo preparar prova icao",
      "tempo preparação icao",
      "plano de estudo prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 5,
    relatedSlugs: [
      "como-se-preparar-para-a-prova-icao",
      "simulado-prova-icao",
      "erros-comuns-prova-icao",
    ],
    category: "prepare",
    phase: 4,
  },
  {
    slug: "vocabulario-aviacao-ingles",
    title: "Vocabulário de Aviação em Inglês: Glossário Completo para Pilotos",
    seoTitle: "Vocabulário de Aviação em Inglês | Easycao",
    description:
      "Glossário completo de vocabulário de aviação em inglês para pilotos. Termos por categoria: aeroporto, ATC, emergências, meteorologia e navegação.",
    keywords: [
      "vocabulário aviação inglês",
      "termos aviação inglês",
      "glossário aviação",
      "inglês para pilotos",
    ],
    updatedAt: "2026-03-03",
    readingTime: 10,
    relatedSlugs: [
      "dicas-prova-icao-descricao-imagens",
      "descritores-da-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "prepare",
    phase: 3,
  },
  {
    slug: "dicas-prova-icao-descricao-imagens",
    title:
      "Dicas para a Prova ICAO: Como Descrever Imagens (Parte 4)",
    seoTitle: "Dicas Descrição de Imagens Prova ICAO | Easycao",
    description:
      "Aprenda a descrever imagens na Parte 4 da prova ICAO. Estrutura ideal, vocabulário essencial e erros comuns na descrição de fotos de aviação.",
    keywords: [
      "dicas prova icao descrição imagens",
      "parte 4 prova icao",
      "descrever imagens prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 6,
    relatedSlugs: [
      "vocabulario-aviacao-ingles",
      "erros-comuns-prova-icao",
      "como-funciona-a-prova-icao",
    ],
    category: "prepare",
    phase: 4,
  },
  {
    slug: "erros-comuns-prova-icao",
    title: "Erros Comuns na Prova ICAO: O que Evitar para Passar",
    seoTitle: "Erros Comuns na Prova ICAO | Easycao",
    description:
      "Conheça os erros mais comuns na prova ICAO por descritor e estratégia. Aprenda o que evitar no dia da prova para garantir sua aprovação.",
    keywords: [
      "erros comuns prova icao",
      "erros prova icao",
      "o que não fazer prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 7,
    relatedSlugs: [
      "reprovado-na-prova-icao",
      "descritores-da-prova-icao",
      "simulado-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "prepare",
    phase: 3,
  },
  {
    slug: "simulado-prova-icao",
    title: "Simulado Prova ICAO: Pratique com o Simulador Easycao",
    seoTitle: "Simulado Prova ICAO — Simulador Easycao | Easycao",
    description:
      "Pratique para a prova ICAO com o simulador Easycao. Grave respostas, receba feedback por descritor e prepare-se com 283 trilhões+ de combinações.",
    keywords: [
      "simulado prova icao",
      "simulado icao",
      "simulador icao",
      "praticar prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 8,
    relatedSlugs: [
      "como-se-preparar-para-a-prova-icao",
      "dicas-prova-icao-descricao-imagens",
      "erros-comuns-prova-icao",
    ],
    category: "prepare",
    phase: 3,
  },

  // ── "Logística e Pós-Prova" (7) ──────────────────────────────────────
  {
    slug: "quanto-custa-a-prova-icao",
    title: "Quanto Custa a Prova ICAO em 2026: Preço + Custos Ocultos",
    seoTitle: "Quanto Custa a Prova ICAO em 2026 | Easycao",
    description:
      "Descubra quanto custa a prova ICAO em 2026: preço por instituição, custos ocultos, custo de reprovação e como economizar. Valores atualizados.",
    keywords: [
      "quanto custa a prova icao",
      "prova icao preço 2026",
      "quanto custa SDEA",
      "custo total prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 8,
    relatedSlugs: [
      "onde-fazer-a-prova-icao",
      "como-agendar-a-prova-icao",
      "reprovado-na-prova-icao",
    ],
    category: "logistics",
    phase: 1,
  },
  {
    slug: "onde-fazer-a-prova-icao",
    title: "Onde Fazer a Prova ICAO: Centros Credenciados e Como Agendar",
    seoTitle: "Onde Fazer a Prova ICAO | Easycao",
    description:
      "Lista completa de centros credenciados para a prova ICAO no Brasil, organizados por região. Saiba como agendar e o que levar no dia da prova.",
    keywords: [
      "onde fazer a prova icao",
      "entidades credenciadas SDEA",
      "centros de prova icao",
      "prova icao são paulo",
    ],
    updatedAt: "2026-03-03",
    readingTime: 10,
    relatedSlugs: [
      "como-agendar-a-prova-icao",
      "quanto-custa-a-prova-icao",
      "sdea-santos-dumont-english-assessment",
    ],
    category: "logistics",
    phase: 1,
  },
  {
    slug: "como-agendar-a-prova-icao",
    title: "Como Agendar a Prova ICAO: Passo a Passo Completo",
    seoTitle: "Como Agendar a Prova ICAO | Easycao",
    description:
      "Aprenda como agendar a prova ICAO passo a passo: documentos necessários, antecedência, centros credenciados e dicas para o dia da prova.",
    keywords: [
      "como agendar prova icao",
      "agendar SDEA",
      "marcar prova icao",
      "agendamento prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 6,
    relatedSlugs: [
      "onde-fazer-a-prova-icao",
      "quanto-custa-a-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "logistics",
    phase: 3,
  },
  {
    slug: "prova-icao-helicoptero",
    title: "Prova ICAO para Helicóptero: O que Muda para Pilotos de Asa Rotativa",
    seoTitle: "Prova ICAO para Helicóptero | Easycao",
    description:
      "Saiba como funciona a prova ICAO para pilotos de helicóptero. Diferenças nos cenários, vocabulário específico e como se preparar.",
    keywords: [
      "prova icao helicóptero",
      "SDEA helicóptero",
      "icao asa rotativa",
      "prova icao piloto helicóptero",
    ],
    updatedAt: "2026-03-03",
    readingTime: 5,
    relatedSlugs: [
      "como-funciona-a-prova-icao",
      "vocabulario-aviacao-ingles",
      "quem-precisa-fazer-prova-icao",
    ],
    category: "logistics",
    phase: 4,
  },
  {
    slug: "resultado-prova-icao",
    title: "Resultado da Prova ICAO: Como Verificar e Entender sua Nota",
    seoTitle: "Resultado da Prova ICAO | Easycao",
    description:
      "Saiba quando sai o resultado da prova ICAO, como verificar no sistema da ANAC, como interpretar a nota e os próximos passos após o resultado.",
    keywords: [
      "resultado prova icao",
      "nota prova icao",
      "resultado SDEA",
      "verificar resultado icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 5,
    relatedSlugs: [
      "niveis-icao",
      "reprovado-na-prova-icao",
      "validade-e-renovacao-prova-icao",
    ],
    category: "logistics",
    phase: 4,
  },
  {
    slug: "validade-e-renovacao-prova-icao",
    title: "Validade da Prova ICAO e Como Renovar sua Certificação",
    seoTitle: "Validade e Renovação da Prova ICAO | Easycao",
    description:
      "Saiba a validade da prova ICAO por nível (3, 6 anos ou vitalícia), quando renovar e o processo de renovação. Planeje-se com antecedência.",
    keywords: [
      "validade prova icao",
      "renovação icao",
      "validade icao nível 4",
      "validade icao nível 5",
    ],
    updatedAt: "2026-03-03",
    readingTime: 7,
    relatedSlugs: [
      "niveis-icao",
      "resultado-prova-icao",
      "como-agendar-a-prova-icao",
    ],
    category: "logistics",
    phase: 3,
  },
  {
    slug: "reprovado-na-prova-icao",
    title: "Reprovado na Prova ICAO: E Agora? Guia de Recuperação",
    seoTitle: "Reprovado na Prova ICAO? Saiba o que Fazer | Easycao",
    description:
      "Reprovou na prova ICAO? Entenda a regra dos 60 dias, como analisar seu resultado, montar um plano de recuperação e evitar reprovar novamente.",
    keywords: [
      "reprovado prova icao",
      "icao nível 3",
      "reprovar prova icao",
      "regra 60 dias icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 8,
    relatedSlugs: [
      "erros-comuns-prova-icao",
      "como-se-preparar-para-a-prova-icao",
      "simulado-prova-icao",
      "quanto-custa-a-prova-icao",
    ],
    category: "logistics",
    phase: 3,
  },
];

// ── Helper functions ──────────────────────────────────────────────────

export function getPageBySlug(slug: string): ContentPage | undefined {
  return CONTENT_PAGES.find((p) => p.slug === slug);
}

export function getRelatedPages(slug: string): ContentPage[] {
  const page = getPageBySlug(slug);
  if (!page) return [];
  return page.relatedSlugs
    .map((s) => getPageBySlug(s))
    .filter((p): p is ContentPage => p !== undefined);
}

export function getPagesByCategory(category: string): ContentPage[] {
  return CONTENT_PAGES.filter((p) => p.category === category);
}

export function getAllPages(): ContentPage[] {
  return CONTENT_PAGES;
}
