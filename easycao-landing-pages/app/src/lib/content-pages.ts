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
  category: "core" | "gap" | "niche";
  phase: number;
}

export const CONTENT_PAGES: ContentPage[] = [
  // ── Core pages (Phase 1) ──────────────────────────────────────────────
  {
    slug: "descritores-da-prova-icao",
    title: "Os 6 Descritores da Prova ICAO: Como Voce e Avaliado",
    seoTitle: "Descritores da Prova ICAO | Easycao",
    description:
      "Entenda os 6 descritores da prova ICAO: Pronunciation, Structure, Vocabulary, Fluency, Comprehension e Interaction. Saiba como cada um e avaliado.",
    keywords: [
      "descritores da prova icao",
      "descritores icao",
      "descritores holisticos icao",
      "como sou avaliado prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 12,
    relatedSlugs: [
      "niveis-icao",
      "como-funciona-a-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "core",
    phase: 1,
  },
  {
    slug: "como-se-preparar-para-a-prova-icao",
    title: "Como se Preparar para a Prova ICAO: Guia Pratico",
    seoTitle: "Como se Preparar para a Prova ICAO | Easycao",
    description:
      "Guia pratico de preparacao para a prova ICAO. Evite os 3 erros mais comuns, saiba o que estudar e quanto tempo leva. Metodo recomendado por examinador.",
    keywords: [
      "como estudar para prova icao",
      "como passar na prova icao",
      "preparacao prova icao",
      "dicas prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 10,
    relatedSlugs: [
      "descritores-da-prova-icao",
      "como-funciona-a-prova-icao",
      "niveis-icao",
      "erros-comuns-prova-icao",
    ],
    category: "core",
    phase: 1,
  },
  {
    slug: "como-funciona-a-prova-icao",
    title: "Como Funciona a Prova ICAO: Guia Completo [2026]",
    seoTitle: "Como Funciona a Prova ICAO | Easycao",
    description:
      "Saiba como funciona a prova ICAO: as 4 partes, duracao, como e avaliada e o que esperar no dia. Guia completo por examinador ICAO credenciado.",
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
      "onde-fazer-a-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "core",
    phase: 1,
  },
  {
    slug: "niveis-icao",
    title: "Niveis ICAO: Entenda a Escala de 1 a 6",
    seoTitle: "Niveis ICAO (1 a 6) Explicados | Easycao",
    description:
      "Entenda os niveis ICAO de 1 a 6: o que cada nivel significa, validade, como e calculado e qual nivel as companhias aereas exigem. Guia completo.",
    keywords: [
      "niveis icao",
      "icao nivel 4",
      "icao nivel 5 validade",
      "icao nivel 6",
      "nota minima prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 9,
    relatedSlugs: [
      "descritores-da-prova-icao",
      "como-funciona-a-prova-icao",
      "validade-e-renovacao-prova-icao",
    ],
    category: "core",
    phase: 1,
  },
  {
    slug: "quanto-custa-a-prova-icao",
    title: "Quanto Custa a Prova ICAO em 2026: Preco + Custos Ocultos",
    seoTitle: "Quanto Custa a Prova ICAO em 2026 | Easycao",
    description:
      "Descubra quanto custa a prova ICAO em 2026: preco por instituicao, custos ocultos, custo de reprovacao e como economizar. Valores atualizados.",
    keywords: [
      "quanto custa a prova icao",
      "prova icao preco 2026",
      "quanto custa SDEA",
      "custo total prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 8,
    relatedSlugs: [
      "onde-fazer-a-prova-icao",
      "como-se-preparar-para-a-prova-icao",
      "como-funciona-a-prova-icao",
    ],
    category: "core",
    phase: 1,
  },
  {
    slug: "onde-fazer-a-prova-icao",
    title: "Onde Fazer a Prova ICAO: Centros Credenciados e Como Agendar",
    seoTitle: "Onde Fazer a Prova ICAO | Easycao",
    description:
      "Lista completa de centros credenciados para a prova ICAO no Brasil, organizados por regiao. Saiba como agendar e o que levar no dia da prova.",
    keywords: [
      "onde fazer a prova icao",
      "entidades credenciadas SDEA",
      "centros de prova icao",
      "prova icao sao paulo",
    ],
    updatedAt: "2026-03-03",
    readingTime: 10,
    relatedSlugs: [
      "como-funciona-a-prova-icao",
      "quanto-custa-a-prova-icao",
      "como-agendar-a-prova-icao",
    ],
    category: "core",
    phase: 1,
  },

  // ── Gap pages (Phase 3) ───────────────────────────────────────────────
  {
    slug: "validade-e-renovacao-prova-icao",
    title: "Validade da Prova ICAO e Como Renovar sua Certificacao",
    seoTitle: "Validade e Renovacao da Prova ICAO | Easycao",
    description:
      "Saiba a validade da prova ICAO por nivel (3, 6 anos ou vitalicia), quando renovar e o processo de renovacao. Planeje-se com antecedencia.",
    keywords: [
      "validade prova icao",
      "renovacao icao",
      "validade icao nivel 4",
      "validade icao nivel 5",
    ],
    updatedAt: "2026-03-03",
    readingTime: 7,
    relatedSlugs: [
      "niveis-icao",
      "como-funciona-a-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "gap",
    phase: 3,
  },
  {
    slug: "sdea-santos-dumont-english-assessment",
    title: "SDEA — Santos Dumont English Assessment: O que e e Como Funciona",
    seoTitle: "SDEA Santos Dumont English Assessment | Easycao",
    description:
      "Entenda o que e o SDEA (Santos Dumont English Assessment), nome oficial da prova ICAO no Brasil. Saiba como funciona, quem aplica e mudancas recentes.",
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
      "descritores-da-prova-icao",
    ],
    category: "gap",
    phase: 3,
  },
  {
    slug: "reprovado-na-prova-icao",
    title: "Reprovado na Prova ICAO: E Agora? Guia de Recuperacao",
    seoTitle: "Reprovado na Prova ICAO? Saiba o que Fazer | Easycao",
    description:
      "Reprovou na prova ICAO? Entenda a regra dos 60 dias, como analisar seu resultado, montar um plano de recuperacao e evitar reprovar novamente.",
    keywords: [
      "reprovado prova icao",
      "icao nivel 3",
      "reprovar prova icao",
      "regra 60 dias icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 8,
    relatedSlugs: [
      "como-se-preparar-para-a-prova-icao",
      "descritores-da-prova-icao",
      "quanto-custa-a-prova-icao",
      "erros-comuns-prova-icao",
    ],
    category: "gap",
    phase: 3,
  },
  {
    slug: "vocabulario-aviacao-ingles",
    title: "Vocabulario de Aviacao em Ingles: Glossario Completo para Pilotos",
    seoTitle: "Vocabulario de Aviacao em Ingles | Easycao",
    description:
      "Glossario completo de vocabulario de aviacao em ingles para pilotos. Termos por categoria: aeroporto, ATC, emergencias, meteorologia e navegacao.",
    keywords: [
      "vocabulario aviacao ingles",
      "termos aviacao ingles",
      "glossario aviacao",
      "ingles para pilotos",
    ],
    updatedAt: "2026-03-03",
    readingTime: 10,
    relatedSlugs: [
      "descritores-da-prova-icao",
      "como-se-preparar-para-a-prova-icao",
      "como-funciona-a-prova-icao",
    ],
    category: "gap",
    phase: 3,
  },
  {
    slug: "simulado-prova-icao",
    title: "Simulado Prova ICAO: Pratique com o Simulador Easycao",
    seoTitle: "Simulado Prova ICAO — Simulador Easycao | Easycao",
    description:
      "Pratique para a prova ICAO com o simulador Easycao. Grave respostas, receba feedback por descritor e prepare-se com 283 trilhoes+ de combinacoes.",
    keywords: [
      "simulado prova icao",
      "simulado icao",
      "simulador icao",
      "praticar prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 8,
    relatedSlugs: [
      "descritores-da-prova-icao",
      "como-se-preparar-para-a-prova-icao",
      "erros-comuns-prova-icao",
    ],
    category: "gap",
    phase: 3,
  },
  {
    slug: "erros-comuns-prova-icao",
    title: "Erros Comuns na Prova ICAO: O que Evitar para Passar",
    seoTitle: "Erros Comuns na Prova ICAO | Easycao",
    description:
      "Conheca os erros mais comuns na prova ICAO por descritor e estrategia. Aprenda o que evitar no dia da prova para garantir sua aprovacao.",
    keywords: [
      "erros comuns prova icao",
      "erros prova icao",
      "o que nao fazer prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 7,
    relatedSlugs: [
      "descritores-da-prova-icao",
      "como-se-preparar-para-a-prova-icao",
      "reprovado-na-prova-icao",
    ],
    category: "gap",
    phase: 3,
  },
  {
    slug: "como-agendar-a-prova-icao",
    title: "Como Agendar a Prova ICAO: Passo a Passo Completo",
    seoTitle: "Como Agendar a Prova ICAO | Easycao",
    description:
      "Aprenda como agendar a prova ICAO passo a passo: documentos necessarios, antecedencia, centros credenciados e dicas para o dia da prova.",
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
    category: "gap",
    phase: 3,
  },
  {
    slug: "quem-precisa-fazer-prova-icao",
    title: "Quem Precisa Fazer a Prova ICAO? Requisitos por Licenca",
    seoTitle: "Quem Precisa Fazer a Prova ICAO | Easycao",
    description:
      "Descubra quem precisa fazer a prova ICAO: requisitos por tipo de licenca (PP, PC, PLA), excecoes automaticas e se voos domesticos exigem.",
    keywords: [
      "quem precisa fazer prova icao",
      "prova icao obrigatoria",
      "icao para piloto privado",
      "icao para comissarios",
    ],
    updatedAt: "2026-03-03",
    readingTime: 6,
    relatedSlugs: [
      "niveis-icao",
      "como-funciona-a-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "gap",
    phase: 3,
  },

  // ── Niche pages (Phase 4) ─────────────────────────────────────────────
  {
    slug: "dicas-prova-icao-descricao-imagens",
    title:
      "Dicas para a Prova ICAO: Como Descrever Imagens (Parte 4)",
    seoTitle: "Dicas Descricao de Imagens Prova ICAO | Easycao",
    description:
      "Aprenda a descrever imagens na Parte 4 da prova ICAO. Estrutura ideal, vocabulario essencial e erros comuns na descricao de fotos de aviacao.",
    keywords: [
      "dicas prova icao descricao imagens",
      "parte 4 prova icao",
      "descrever imagens prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 6,
    relatedSlugs: [
      "como-funciona-a-prova-icao",
      "descritores-da-prova-icao",
      "vocabulario-aviacao-ingles",
    ],
    category: "niche",
    phase: 4,
  },
  {
    slug: "quanto-tempo-preparar-prova-icao",
    title: "Quanto Tempo Leva para se Preparar para a Prova ICAO?",
    seoTitle: "Quanto Tempo para Preparar para Prova ICAO | Easycao",
    description:
      "Descubra quanto tempo leva para se preparar para a prova ICAO, com timelines por nivel de ingles e plano de estudo semanal recomendado.",
    keywords: [
      "quanto tempo preparar prova icao",
      "tempo preparacao icao",
      "plano de estudo prova icao",
    ],
    updatedAt: "2026-03-03",
    readingTime: 5,
    relatedSlugs: [
      "como-se-preparar-para-a-prova-icao",
      "niveis-icao",
      "erros-comuns-prova-icao",
    ],
    category: "niche",
    phase: 4,
  },
  {
    slug: "prova-icao-helicoptero",
    title: "Prova ICAO para Helicoptero: O que Muda para Pilotos de Asa Rotativa",
    seoTitle: "Prova ICAO para Helicoptero | Easycao",
    description:
      "Saiba como funciona a prova ICAO para pilotos de helicoptero. Diferencas nos cenarios, vocabulario especifico e como se preparar.",
    keywords: [
      "prova icao helicoptero",
      "SDEA helicoptero",
      "icao asa rotativa",
      "prova icao piloto helicoptero",
    ],
    updatedAt: "2026-03-03",
    readingTime: 5,
    relatedSlugs: [
      "como-funciona-a-prova-icao",
      "descritores-da-prova-icao",
      "como-se-preparar-para-a-prova-icao",
    ],
    category: "niche",
    phase: 4,
  },
  {
    slug: "resultado-prova-icao",
    title: "Resultado da Prova ICAO: Como Verificar e Entender sua Nota",
    seoTitle: "Resultado da Prova ICAO | Easycao",
    description:
      "Saiba quando sai o resultado da prova ICAO, como verificar no sistema da ANAC, como interpretar a nota e os proximos passos apos o resultado.",
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
    category: "niche",
    phase: 4,
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
