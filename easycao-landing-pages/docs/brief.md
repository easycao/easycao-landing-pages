# Project Brief — Easycao Full Website

**Data:** 2026-03-03
**Autor:** Atlas (@analyst)
**Status:** Draft — Aguardando handoff para @pm

---

## 1. Visao Geral

Reconstruir completamente o website da Easycao sobre o stack Next.js existente (atualmente 2 paginas: `/lives` + `/confirma-cadastro-lives`). O site antigo em easycao.com.br (Klickpages/Hotmart) possui homepage, pagina de vendas e conteudo disperso — tudo sera substituido por uma arquitetura moderna com SEO agressivo, funil de conversao otimizado e conteudo autoritativo.

**Escopo total:** 22 paginas (2 existentes intocadas + 20 novas)

---

## 2. Contexto do Negocio

### Sobre a Easycao
- **O que e:** Escola de ingles preparatorio para a prova ICAO (Santos Dumont English Assessment / SDEA)
- **Instrutor:** Diogo Verzola — Examinador ICAO credenciado pela ANAC, certificado Cambridge, 20+ anos de experiencia, ex-controlador de trafego aereo
- **Produto principal:** Metodo Easycao — curso online com 6 modulos + 36 tecnicas + simulador proprietario (iOS + Android)
- **App:** Simulador ICAO — usuario grava respostas faladas, recebe feedback por descritor baseado no Doc 9835 da ICAO. 283 trilhoes+ de combinacoes. Unico simulador ICAO do mercado
- **Comunidade:** Maior comunidade de pilotos preparando para ICAO no Brasil
- **Lives gratuitas:** Terca 19h (Instagram) + Quinta 13h30 (YouTube)
- **Checkout atual:** Hotmart (`pay.hotmart.com/Y27990783F`)

### Publico-Alvo
- **Primario:** Pilotos brasileiros licenciados (PP, PC, PLA/ATPL) que precisam de proficiencia em ingles ICAO para operar internacionalmente
- **Secundario:** Pilotos renovando certificacao (Level 4 a cada 3 anos, Level 5 a cada 6 anos)
- **Terciario:** Pilotos reprovados buscando recuperacao (regra dos 60 dias)

### Motivacoes do Publico (pesquisa infoproduct)
1. Avanco na carreira / aumento salarial
2. Pressao de tempo (data da prova proxima)
3. Reprovacao anterior
4. Pressao competitiva no mercado
5. Justificativa financeira para investimento
6. Medo de perder tempo com metodo errado

---

## 3. Objetivos de Negocio

| # | Objetivo | Metrica | Meta |
|---|----------|---------|------|
| 1 | Capturar trafego organico informacional | Sessoes organicas/mes | 5.000 em 6 meses |
| 2 | Converter visitantes em leads (lives) | Taxa de conversao /lives | Manter ou melhorar atual |
| 3 | Converter visitantes em alunos (metodo) | Cliques no CTA /metodo → checkout | Tracking via GTM |
| 4 | Estabelecer autoridade topica (E-E-A-T) | Posicoes top 3 para keywords primarias | 6+ keywords em 6 meses |
| 5 | Dominar content gaps com zero concorrencia | Paginas indexadas rankeando | 12 gaps cobertos |
| 6 | Reduzir dependencia de trafego pago | % organico vs pago | 40% organico em 12 meses |
| 7 | Promover downloads do app | Cliques nos badges App Store/Play Store | Tracking via GTM |

---

## 4. Analise Competitiva (resumo)

Fonte: `docs/reference-metodo-competitor-analysis.md`

| Concorrente | Forca Principal | Fraqueza Principal |
|-------------|-----------------|-------------------|
| **ClearSky** | 17+ anos, aulas presenciais, curso helicoptero | Design desatualizado, sem app/simulador/comunidade |
| **GearUp** | Preco transparente, trial 7 dias, app iOS | Marca jovem (2021), nao e examinador, sem Cambridge |
| **Vector** | Aulas 1-on-1 Zoom, material gratuito | Site Wix amador, nao escalavel |
| **Ingles ICAO** | Vercel hosting | Dados limitados |

### Vantagem Competitiva Easycao (incontestavel)
1. **Unico examinador ICAO credenciado** ensinando — nenhum concorrente tem isso
2. **Unico simulador ICAO do mercado** (app iOS + Android)
3. **Maior comunidade de pilotos** preparando para ICAO
4. **Lives semanais gratuitas** com o examinador

### SWOT — Oportunidades no Website
- Design moderno Next.js vs Klickpages/Wix/Bootstrap dos concorrentes
- Preco transparente (GearUp faz isso, Easycao nao)
- Trial ou lead magnet (GearUp oferece 7 dias gratis)
- Numeros especificos verificaveis ("+1.500 aprovados" vs "milhares")
- SEO agressivo em 12 content gaps sem concorrencia

---

## 5. Arquitetura do Site

### Mapa de Paginas (22 total)

```
easycao.com
├── /                                    Homepage (hub)
├── /metodo                              Pagina de vendas (conversao)
├── /lives                               Landing lives (EXISTENTE — manter)
├── /confirma-cadastro-lives             Obrigado (EXISTENTE — manter)
│
├── CONTEUDO CORE (6 paginas)
│   ├── /descritores-da-prova-icao       6 descritores ICAO
│   ├── /como-se-preparar-para-a-prova-icao   Guia de preparacao
│   ├── /como-funciona-a-prova-icao      Como a prova funciona
│   ├── /niveis-icao                     Niveis 1-6 explicados
│   ├── /quanto-custa-a-prova-icao       Custos + custos ocultos
│   └── /onde-fazer-a-prova-icao         Centros credenciados
│
├── CONTEUDO GAP (8 paginas)
│   ├── /validade-e-renovacao-prova-icao
│   ├── /sdea-santos-dumont-english-assessment
│   ├── /reprovado-na-prova-icao
│   ├── /vocabulario-aviacao-ingles      (glossario = SEO long-tail massivo)
│   ├── /simulado-prova-icao
│   ├── /erros-comuns-prova-icao
│   ├── /como-agendar-a-prova-icao
│   └── /quem-precisa-fazer-prova-icao
│
└── CONTEUDO NICHO (4 paginas)
    ├── /dicas-prova-icao-descricao-imagens
    ├── /quanto-tempo-preparar-prova-icao
    ├── /prova-icao-helicoptero
    └── /resultado-prova-icao
```

### Arquitetura de Layout (Next.js App Router)

- **Route group `(marketing)/`** — compartilha Navbar + Footer para todas as paginas novas
- **`/lives`** — mantem layout proprio (`HeaderCountdown`) sem Navbar compartilhada
- **`/confirma-cadastro-lives`** — standalone, sem alteracao

### Funis de Conversao

```
Trafego Organico (SEO)
  → Pagina de Conteudo (/descritores, /como-funciona, etc.)
    → CTA sidebar/footer → /metodo (conversao)
    → CTA lateral → /lives (lead capture)

Trafego Pago (Ads)
  → /lives (lead capture)
    → Mailchimp → Nurture → /metodo

Homepage (/)
  → Content Hub → Paginas de conteudo (autoridade)
  → CTA → /metodo (conversao direta)
  → Banner → /lives (lead capture)

App Discovery
  → Sidebar em todas paginas de conteudo
  → Secao dedicada na homepage
  → Secao dedicada em /metodo
  → Pagina completa em /simulado-prova-icao
```

---

## 6. Estrategia de Conteudo

Fonte: `docs/content-strategy.md` + `docs/reference-search-trends.md`

### Modelo Topical Cluster
- **Hub central:** Homepage (/) conecta tudo
- **Cluster ICAO:** 6 paginas core + 8 gap + 4 nicho = 18 paginas de conteudo
- **Pillar page:** `/descritores-da-prova-icao` (pagina mais densa, recupera 404 existente)
- **Conversion page:** `/metodo` (PAS + StoryBrand framework)

### Especificacoes por Tipo de Pagina

| Tipo | Palavras | Estrutura | Schema |
|------|----------|-----------|--------|
| Core | 1.500-3.000 | Hero + Article + Sidebar + FAQ + Author + Related + CTA | Article + FAQPage + BreadcrumbList |
| Gap | 1.500-2.500 | Mesma estrutura core | Article + FAQPage + BreadcrumbList |
| Nicho | 1.000-1.800 | Mesma estrutura core | Article + FAQPage + BreadcrumbList |
| Homepage | N/A | 11 secoes (hero, trust, hub, professor, app, approvals, etc.) | Organization + Person + MobileApplication |
| Sales | 5.000-8.000 | 16 secoes PAS (hero → FAQ → final CTA) | Course + FAQPage + Person + MobileApplication |

### Padrao SEO por Pagina
- Title: `[Keyword] | Easycao` (max 60 chars)
- Meta description: 150-160 chars com keyword + CTA
- H1: unico, com keyword primaria
- Internal links: min 3 siblings + 1 para /metodo
- External link: min 1 para site oficial ANAC (E-E-A-T)
- Author: "Diogo Verzola, Examinador ICAO Credenciado"
- og:image: unico por pagina
- Texto: "Atualizado em [mes] 2026"

### Prioridade de Implementacao (baseada em impacto SEO)

**Fase 1 — Core (impacto imediato):**
1. `/descritores-da-prova-icao` — recupera 404, maior autoridade
2. `/como-se-preparar-para-a-prova-icao` — ponte direta para /metodo
3. `/como-funciona-a-prova-icao` — maior volume de busca
4. `/niveis-icao` — comparacao visual forte
5. `/quanto-custa-a-prova-icao` — intent comercial
6. `/onde-fazer-a-prova-icao` — 11 centros com dados reais

**Fase 2 — Gap (zero concorrencia):**
7-14. 8 paginas gap em ordem de volume + intent comercial

**Fase 3 — Nicho (long-tail):**
15-18. 4 paginas nicho

---

## 7. Estrategia de SEO

### Keywords Tier 1 (alto volume)
- "prova ICAO", "SDEA", "como funciona a prova ICAO"
- "quanto custa a prova ICAO", "onde fazer a prova ICAO"
- "niveis ICAO", "ingles ICAO", "curso ICAO"

### Keywords Tier 2 (medio volume, gaps)
- "descritores da prova ICAO", "simulado ICAO"
- "validade prova ICAO", "prova ICAO nivel 4/6"
- "vocabulario aviacao ingles", "SDEA Santos Dumont"

### Padroes Sazonais
- **Jan-Mar:** SUBINDO (ano novo, renovacoes)
- **Abr-Jun:** PICO (temporada pre-inverno)
- **Jul-Ago:** MODERADO (pilotos voando)
- **Set-Nov:** SUBINDO NOVAMENTE
- **Dez:** QUEDA (ferias)

### Schema Markup Completo
- `Organization` — homepage
- `Person` — Diogo (todas as paginas com AuthorBox)
- `Article` — todas paginas de conteudo
- `FAQPage` — todas paginas com FAQ
- `BreadcrumbList` — todas paginas
- `Course` — /metodo
- `MobileApplication` — /simulado, /metodo, homepage
- `Event` — /lives (existente)

---

## 8. Integracao do App

O app Easycao (iOS + Android) e um diferencial competitivo unico — nenhum concorrente tem simulador ICAO. Deve aparecer em:

| Pagina | Posicao | Formato |
|--------|---------|---------|
| Homepage | Secao entre Professor e Aprovacoes | Full-width com mockup |
| /metodo | SimulatorSection (#8) + BonusStack | Secao completa + mencao bonus |
| /descritores | Inline apos dicas por descritor | Card compacto |
| /como-se-preparar | Inline em metodo de estudo | Card compacto |
| /como-funciona | Inline apos 4 partes da prova | Card compacto |
| /simulado-prova-icao | Pagina inteira dedicada ao app | Showcase completo |
| /erros-comuns | Inline na secao de dicas | Card compacto |
| Sidebar (todas) | Todas paginas de conteudo | Card sidebar |

---

## 9. Pagina de Vendas (/metodo)

Fonte: `docs/reference-infoproduct-strategies.md` + `docs/reference-metodo-competitor-analysis.md`

### Framework: PAS + StoryBrand (hibrido)
Baseado em pesquisa de mercado infoproduct brasileiro:

| # | Secao | Objetivo |
|---|-------|----------|
| 1 | Hero + VSL placeholder | Transformacao + CTA primario |
| 2 | Problema | Identificacao de dor |
| 3 | Agitacao | Consequencias (carreira, dinheiro, tempo) |
| 4 | Autoridade | Diogo: examinador + Cambridge + 20 anos |
| 5 | Revelacao do Metodo | "Nao e curso — e METODO" |
| 6 | Prova Social #1 | Video depoimentos + prints WhatsApp |
| 7 | Modulos | 6 modulos em cards visuais |
| 8 | Simulador + App | 283T combinacoes, mockup do app |
| 9 | Comunidade | "Maior comunidade de pilotos" |
| 10 | Bonus | Value stack com precos individuais |
| 11 | Mural de Aprovados | Galeria de aprovados + notas |
| 12 | Preco | Value stack ancorado + parcelas + PIX |
| 13 | Garantia | 30 dias incondicional |
| 14 | FAQ | 10-12 perguntas (objecoes) |
| 15 | CTA Final | Urgencia + escassez |
| 16 | Sticky Mobile CTA | Barra fixa no mobile |

### Elementos Criticos (pesquisa competitiva)
- **Preco transparente** — GearUp faz, Easycao nao (oportunidade)
- **4-6 CTAs** distribuidos ao longo da pagina
- **WhatsApp float** para pre-venda
- **Parcelas + desconto PIX** (padrao brasileiro)
- **Numeros especificos** ("1.500+ aprovados" nao "milhares")

---

## 10. Componentes Compartilhados

### Globais (todas paginas)
- `Navbar` — Sticky blur, logo, links ("Prova ICAO" dropdown → conteudo, "Metodo", "Lives"), CTA "Matricular", hamburger mobile
- `Footer` — 4 colunas: Sobre / Conteudo / Metodo / Social
- `WhatsAppFloat` — Botao fixo bottom-right, animacao pulse
- `AppBanner` — 3 variantes: section (full-width) / inline (card) / sidebar (compacto)

### Paginas de Conteudo (reutilizados)
- `ContentPageLayout` — Wrapper: hero + 2-column (article + sidebar) + FAQ + author + related + CTA
- `Breadcrumbs` — Trail com BreadcrumbList JSON-LD
- `FAQAccordion` — Expand/collapse com FAQPage JSON-LD
- `AuthorBox` — Foto Diogo + credenciais (E-E-A-T)
- `RelatedPages` — 3-4 cards de paginas relacionadas
- `CTABand` — Banda gradiente, variantes "metodo" e "lives"
- `TableOfContents` — Sidebar sticky, highlight secao ativa
- `CalloutBox` — Info/warning/tip
- `ArticleMeta` — Data, tempo de leitura, autor

### Utilitarios
- `content-pages.ts` — Registro central de todas paginas (slug, titulo, descricao, keywords, relatedSlugs)
- `schema.ts` — Geradores JSON-LD
- `constants.ts` — WhatsApp link, URLs sociais, metadata

---

## 11. Requisitos Tecnicos

### Stack (sem novas dependencias)
- Next.js 16 (App Router) — ja configurado
- React 19 — ja configurado
- Tailwind CSS v4 — ja configurado
- CSS keyframes — animacoes (nao JS pesado)
- `useInView` hook existente — scroll reveal

### Performance
- LCP < 2.5s
- CLS < 0.1
- Mobile-first (70-80% trafego mobile no Brasil)
- Font display: swap (Poppins ja configurado)
- AVIF/WebP images (ja configurado)
- DNS prefetch/preconnect (ja configurado)

### Infraestrutura
- Deploy: Vercel
- Dominio: easycao.com (DNS no HostGator → CNAME Vercel)
- Analytics: GTM Web (`GTM-PDLS5SL`)
- Email: Mailchimp API v3 (ja integrado)
- Checkout: Hotmart (link externo)

### Mudancas de Infraestrutura Necessarias
1. Remover redirect `/` → `/lives` do `next.config.ts`
2. Generalizar metadata no root `layout.tsx`
3. Atualizar `sitemap.ts` para gerar dinamicamente
4. Adicionar estilos de prosa ao `globals.css`
5. Mover `ProfessorSection.tsx` para `components/` (reutilizar)

---

## 12. Identidade Visual

Fonte: `docs/style-guide.md`

| Elemento | Valor |
|----------|-------|
| Cor principal | `#1F96F7` (azul) |
| Cor escura | `#0057B4` |
| Cor clara | `#34B8F8` |
| Preto | `#353535` (warm charcoal) |
| Fonte | Poppins (400-700) |
| Border radius | 16px cards, 12px buttons |
| Glass effect | rgba(255,255,255,0.08) + blur(16px) |
| Gradiente hero | `#0a3d6b` → primary-dark → primary |
| Animacoes | fade-in-up, pulse-subtle, marquee |
| Mobile | Mobile-first, sm/md/lg breakpoints |

---

## 13. Restricoes e Regras

1. **`/lives` NUNCA quebra** — intocada em todas as fases
2. **`/confirma-cadastro-lives` NUNCA quebra** — intocada
3. **Zero novas dependencias** — tudo via Tailwind + CSS + hooks existentes
4. **Route groups** — `(marketing)` para layout compartilhado sem impacto em URLs
5. **Content registry unico** — `content-pages.ts` como fonte de verdade
6. **Schema consistente** — geradores em `schema.ts`, sem copy-paste
7. **Mobile-first** — todos componentes desenhados para mobile primeiro

---

## 14. Metricas de Sucesso

| Metrica | Baseline | Meta 3 meses | Meta 6 meses |
|---------|----------|--------------|--------------|
| Paginas indexadas | 2 | 12 | 22 |
| Sessoes organicas/mes | ~500 | 2.000 | 5.000 |
| Keywords top 10 | 3 | 15 | 30 |
| Taxa conversao /lives | Atual | Manter | Melhorar 10% |
| Cliques CTA /metodo | 0 | Tracking | Otimizar |
| Downloads app | 0 tracking | Tracking | Otimizar |
| LCP (todas paginas) | N/A | < 2.5s | < 2.0s |
| CLS (todas paginas) | N/A | < 0.1 | < 0.05 |

---

## 15. Fases de Implementacao

| Fase | Escopo | Dependencia |
|------|--------|-------------|
| **0** | Infraestrutura (lib, componentes globais, layouts) | Nenhuma |
| **1A** | Biblioteca de componentes de conteudo | Fase 0 |
| **1B** | Homepage (/) | Fase 0 |
| **1C** | 6 paginas de conteudo core | Fase 1A |
| **2** | Pagina de vendas (/metodo) | Fase 1C |
| **3A** | 4 paginas gap alta prioridade | Fase 1A |
| **3B** | 4 paginas gap funil | Fase 1A |
| **4** | 4 paginas nicho | Fase 1A |

---

## 16. Handoff para @pm

Este brief esta pronto para o @pm (Morgan) criar o PRD detalhado com:
- Epics por fase
- User stories detalhadas
- Acceptance criteria por story
- Definicao de pronto (DoD)
- Sequenciamento de stories

**Documentos de referencia para o PRD:**
- `docs/brief.md` (este documento)
- `docs/content-strategy.md`
- `docs/reference-anac-proficiencia.md`
- `docs/reference-icao-doc-9835.md`
- `docs/reference-infoproduct-strategies.md`
- `docs/reference-metodo-competitor-analysis.md`
- `docs/reference-search-trends.md`
- `docs/style-guide.md`

---

*Brief criado por Atlas (@analyst) — Synkra AIOS*
