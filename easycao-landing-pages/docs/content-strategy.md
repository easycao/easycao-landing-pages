# Easycao — Content Strategy & Page Plans

## Website Architecture

### Homepage (/)
**Purpose:** Trust-building hub — "This is THE place for ICAO preparation"
**Primary CTA:** "Conhecer o Metodo" → /metodo
**Secondary:** Scroll to content hub

| # | Section | Purpose | Background |
|---|---------|---------|------------|
| 1 | Navbar | Navigation + "Matricular" CTA | white/blur (sticky) |
| 2 | Hero | Welcome — text-driven, NO photo, aspirational | gradient (dark) |
| 3 | Trust Strip | +1000 aprovados, examinador credenciado, lives gratuitas | white |
| 4 | What is Easycao | School philosophy — why we exist | white |
| 5 | Content Hub | "Tudo sobre a Prova ICAO" — 4 cards to content pages | gray-light |
| 6 | Professor | Diogo's credentials + authority | white |
| 7 | Approvals | Carousel of student approvals | gray-light |
| 8 | Lives Banner | Subtle: "Participe das lives gratuitas" → /lives | gradient (subtle) |
| 9 | CTA Final | "Pronto?" → Matricular | gradient (dark) |
| 10 | Footer | Full footer with links | primary-dark |
| | WhatsApp Float | Persistent bottom-right on ALL pages | green circle |

**Hero concept:** No photo. Clean, text-focused. Headline: "Tudo que voce precisa para ser aprovado no ICAO." Subtitle positions Easycao as complete hub. Decorative gradient orbs only.

**Journey:** "This is the place" → "Here's proof" → "Here's what we believe" → "Learn about the exam" → "Meet who's behind it" → "See who already passed" → "Ready? Enroll."

---

## Topical Cluster Architecture

```
              [Homepage — Hub]
                    |
    +-------+-------+-------+-------+
    |       |       |       |       |
  [Como   [Quanto [Onde   [Niveis [Descritores
funciona] custa]  fazer]  ICAO]   ICAO] ← recover 404
                                    |
                              [Como se preparar] ← NEW
```

Every page links to 2-3 siblings + back to homepage. This builds topical authority.

---

## Content Page 1: /como-funciona-a-prova-icao

**Target keyword:** "como funciona a prova icao"
**Secondary:** prova icao 4 partes, prova icao quanto tempo dura, prova icao online
**Intent:** Informational — pilots at awareness/research stage
**Word count:** 2000-2500

### Improvements over current
| Area | Current | New |
|------|---------|-----|
| Structure | Long flowing text | Clear H2/H3 hierarchy for featured snippets |
| Visuals | None | Infographic of 4 exam parts, scoring diagram |
| Duration | Not mentioned clearly | "approximately 45 minutes" prominently |
| FAQ | None | 5-6 FAQ with schema markup |
| Online myth | Not addressed | Clarify "the exam is NOT online" |
| 60-day rule | Buried | Highlight in callout box |
| Internal links | Basic nav only | Link to /descritores, /niveis, /como-se-preparar |

### Outline
1. **H1:** Como funciona a Prova ICAO: Guia Completo [2026]
2. **Intro:** What it is, why it matters
3. **H2:** As 4 partes da prova ICAO (visual cards per part)
   - H3: Part 1 — Aviation Topics
   - H3: Part 2 — Interacting as a Pilot
   - H3: Part 3 — Unexpected Situations
   - H3: Part 4 — Picture Description
4. **H2:** Como voce e avaliado — Os 6 descritores (links to /descritores)
5. **H2:** Quanto tempo dura a prova?
6. **H2:** Como funciona a nota (scoring rule with visual diagram)
7. **H2:** Validade da certificacao (table: L4=3yr, L5=6yr, L6=lifetime)
8. **H2:** Perguntas frequentes (FAQ schema)
   - A prova e online? (No)
   - Posso remarcar? (Yes, depends on institution)
   - O que acontece se eu reprovar? (60-day wait)
   - Preciso de ICAO para voos domesticos? (Not required but valued)
   - Quanto tempo leva para se preparar? (2-6 months)
9. **CTA:** /metodo + /lives

**Schema:** FAQPage + Article + BreadcrumbList

---

## Content Page 2: /quanto-custa-a-prova-icao

**Target keyword:** "quanto custa a prova icao"
**Secondary:** prova icao preco 2026, quanto custa SDEA, custo total prova icao
**Intent:** Commercial investigation — pilots planning to schedule
**Word count:** 1500-2000

### Improvements over current
| Area | Current | New |
|------|---------|-----|
| Pricing | "approximately R$1,000" | Specific 2026 table by institution |
| Cost breakdown | Text list | Visual cost breakdown card/infographic |
| Retake cost | Mentioned vaguely | Calculator: "If you fail X times, total = Y" |
| Comparison | Paulo vs Joao story | Keep but add real numbers |
| Year | Not dated | "Atualizado em 2026" in title + schema |
| FAQ | None | Schema FAQ |

### Outline
1. **H1:** Quanto custa a Prova ICAO em 2026: Preco + custos ocultos
2. **H2:** Custo direto da prova (table by institution)
3. **H2:** Custos ocultos que ninguem fala (visual breakdown)
   - Passagem aerea, hospedagem, alimentacao, transporte, material
4. **H2:** Custo total real (R$1,500 - R$2,500)
5. **H2:** O custo de reprovar (retake math + 60-day delay)
6. **H2:** Paulo vs Joao — Dois caminhos, dois custos
7. **H2:** Como economizar na prova ICAO
8. **H2:** Perguntas frequentes
9. **CTA:** /metodo (invest once, pass first time)

**Schema:** FAQPage + Article + BreadcrumbList
**Note:** Needs annual updates for "2026" searches

---

## Content Page 3: /onde-fazer-a-prova-icao

**Target keyword:** "onde fazer a prova icao"
**Secondary:** entidades credenciadas SDEA, centros de prova ICAO, prova icao sao paulo
**Intent:** Transactional — pilots ready to schedule
**Word count:** 2000-2500

### Improvements over current
| Area | Current | New |
|------|---------|-----|
| Entity list | Links to ANAC PDF | Actual table of major centers with city, phone, website |
| Regions | None | Organized by region (Sul, Sudeste, Nordeste, etc.) |
| Scheduling | Not explained | Step-by-step how to schedule |
| Tips | Generic | Practical: what to bring, what to expect on the day |
| Local SEO | None | H3 subheadings by major city for long-tail capture |

### Outline
1. **H1:** Onde fazer a Prova ICAO: Centros credenciados e como agendar
2. **H2:** Quem pode aplicar a prova ICAO
3. **H2:** Principais centros credenciados por regiao
   - H3: Sudeste (SP, RJ, MG)
   - H3: Sul (PR, SC, RS)
   - H3: Nordeste
   - H3: Centro-Oeste / Norte
4. **H2:** Se voce e piloto de companhia aerea
5. **H2:** Como agendar sua prova — passo a passo
6. **H2:** O que levar no dia da prova
7. **H2:** Dicas para escolher o melhor centro
8. **H2:** Perguntas frequentes
9. **CTA:** /como-se-preparar + /metodo

**Schema:** FAQPage + Article + BreadcrumbList

---

## Content Page 4: /niveis-icao

**Target keyword:** "niveis icao"
**Secondary:** icao nivel 4, icao nivel 5 validade, icao nivel 6, nota minima prova icao
**Intent:** Informational — understanding the scoring system
**Word count:** 1800-2200

### Improvements over current
| Area | Current | New |
|------|---------|-----|
| Visual | Text only | Comparison table + visual scale diagram |
| Validity | In text | Clear table (level / validity / renewal) |
| Career impact | Not addressed | What each level means for career |
| Level 6 | Brief mention | Dedicated section explaining 2-stage process |
| Airlines | Not mentioned | Which airlines require which levels |

### Outline
1. **H1:** Niveis ICAO: Entenda a escala de 1 a 6
2. **H2:** A escala ICAO em resumo (visual comparison table)
3. **H2:** Nivel 3 e abaixo — O que significa reprovar
4. **H2:** Nivel 4 — O minimo operacional
5. **H2:** Nivel 5 — Avancado
6. **H2:** Nivel 6 — Expert (2-stage process)
7. **H2:** Como a nota e calculada (link to /descritores)
8. **H2:** Qual nivel as companhias aereas exigem
9. **H2:** Perguntas frequentes
10. **CTA:** /como-se-preparar + /metodo

**Schema:** FAQPage + Article + BreadcrumbList

---

## Content Page 5: /descritores-da-prova-icao (RECOVER 404)

**Target keyword:** "descritores icao", "descritores da prova icao"
**Secondary:** descritores holisticos icao, como sou avaliado prova icao
**Intent:** Informational (deep research)
**Word count:** 2500-3000 (longest — authority play)
**Opportunity:** HIGH — no competitor has a dedicated page for this

### Outline
1. **H1:** Os 6 Descritores da Prova ICAO: Como voce e avaliado
2. **H2:** O que sao os descritores holisticos (overview + "lowest = final" rule)
3. **H2:** Descritor 1 — Pronunciation (what evaluators look for, common errors)
4. **H2:** Descritor 2 — Structure (grammar patterns, NOT traditional grammar)
5. **H2:** Descritor 3 — Vocabulary (aviation-specific + general range)
6. **H2:** Descritor 4 — Fluency (speed, pauses, filler words)
7. **H2:** Descritor 5 — Comprehension (how they test it)
8. **H2:** Descritor 6 — Interaction (turn-taking, clarification, recovery)
9. **H2:** Como funciona a nota final (visual: 6 scores → lowest = result)
10. **H2:** Dicas para melhorar cada descritor
11. **H2:** Perguntas frequentes
12. **CTA:** /lives (practice in simulado) + /metodo

**Schema:** FAQPage + Article + BreadcrumbList
**Visual:** Radar/spider chart of the 6 descriptors

---

## NEW Content Page 6: /como-se-preparar-para-a-prova-icao

**Target keyword:** "como estudar para prova icao", "como passar na prova icao"
**Secondary:** dicas prova icao, preparacao prova icao, quanto tempo preparar icao
**Intent:** Informational/Commercial — highest funnel value
**Word count:** 2000-2500
**Opportunity:** HIGH — bridges informational content to /metodo conversion

### Outline
1. **H1:** Como se preparar para a Prova ICAO: Guia pratico
2. **H2:** Os 3 erros mais comuns na preparacao
   - Decorar respostas
   - Estudar ingles geral (not ICAO-specific)
   - Nao praticar fala
3. **H2:** O que estudar (linked to /descritores)
4. **H2:** Quanto tempo leva (2-6 months depending on level)
5. **H2:** Metodo de estudo recomendado (positions Easycao)
6. **H2:** Recursos gratuitos (lives, simulados — links to /lives)
7. **H2:** Quando voce esta pronto para a prova (self-assessment checklist)
8. **H2:** Perguntas frequentes
9. **CTA:** /metodo (strongest conversion page in cluster)

**Schema:** FAQPage + Article + HowTo + BreadcrumbList

---

## Cross-Page SEO Standards

| Element | Standard |
|---------|----------|
| Title tag | Primary keyword + brand: "Como funciona a Prova ICAO \| Easycao" |
| Meta description | 150-160 chars, keyword + CTA |
| H1 | One per page, includes primary keyword |
| URL | Lowercase, hyphens, keyword-rich |
| Schema | FAQPage + Article + BreadcrumbList on every page |
| Internal links | Min 3 links to sibling pages + 1 to /metodo |
| External link | At least 1 to ANAC official source (E-E-A-T) |
| Author | "Diogo Verzola, Examinador ICAO Credenciado" (E-E-A-T) |
| Images | 1 hero + 1-2 diagrams/infographics, WebP/AVIF, descriptive alt |
| Reading level | Clear, direct Portuguese |
| Updated date | "Atualizado em [month] 2026" for freshness signals |
| Open Graph | Unique og:title, og:description, og:image per page |

---

## Implementation Priority

| Priority | Page | Reason |
|----------|------|--------|
| 1 | /descritores-da-prova-icao | Uncontested keyword, recover lost URL, market gap |
| 2 | /como-se-preparar-para-a-prova-icao | Highest commercial intent, bridges to /metodo |
| 3 | /como-funciona-a-prova-icao | Highest traffic page, needs modernization |
| 4 | /niveis-icao | Needs visual table + Level 6 expansion |
| 5 | /quanto-custa-a-prova-icao | Needs 2026 pricing update |
| 6 | /onde-fazer-a-prova-icao | Needs actual entity list (biggest content gap) |

---

## Future Content Opportunities (Phase 2)

| Page | Keywords | Priority |
|------|----------|----------|
| Validade da prova ICAO e renovacao | validade icao, renovacao icao | Medium |
| ICAO 6: como conseguir o nivel expert | icao 6, nivel 6 icao | Medium |
| O que e o SDEA | SDEA, Santos Dumont English Assessment | Medium |
| Prova ICAO reprovado: e agora? | reprovacao prova icao, icao nivel 3 | Medium |
| Vocabulario de aviacao para prova ICAO | vocabulario aviacao icao | Low |
| Prova ICAO para helicoptero | prova icao helicoptero | Low |

---

## Competitor Landscape

| Competitor | Strengths | Weaknesses |
|-----------|-----------|------------|
| Vigilancia Aerea | Very detailed 4-part breakdown | No product, just informational |
| EJ Escola de Aviacao | Covers exam + prep course | Less SEO-focused |
| Blog Bianch | Good overview | Less comprehensive |
| ClearSky | Simulado offerings | Content behind product wall |
| Vector ICAO | Free study material hook | Less content depth |
| GearUp ICAO | Simulator platform | Limited informational content |
| Canal Piloto | Good authority site | Shallow ICAO coverage |

**Easycao advantage:** Diogo is a credentialed ICAO examiner — strongest E-E-A-T signal in the market. No competitor has this.
