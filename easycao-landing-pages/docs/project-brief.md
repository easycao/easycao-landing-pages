# Project Brief — Easycao Landing Page de Captação para Lives

**Data:** 2026-03-02
**Autor:** Atlas (@analyst)
**Status:** Aprovado para handoff

---

## 1. Visão Geral

Criar uma landing page de captação de leads para as lives semanais gratuitas da Easycao — escola de inglês preparatório para a prova ICAO. A página deve captar nome, email e telefone, armazenar no Mailchimp com a tag "Lives", e redirecionar para uma página de obrigado com CTA para o grupo do WhatsApp.

## 2. Sobre a Easycao

- **O que é:** Escola de inglês preparatório para a prova ICAO
- **Instrutor:** Diogo Verzola — Examinador ICAO credenciado e criador do Método Easycao
- **Público-alvo:** Pilotos já licenciados (PP, PC, Multi, IFR) que precisam do ICAO para alcançar melhores oportunidades. Tanto primeira prova quanto renovação — comunicação unificada, sem distinção.
- **Valores da marca:** Integridade, Segurança, Confiança, Esforço, Vontade de vencer

## 3. Identidade Visual

| Elemento | Valor |
|----------|-------|
| **Cor principal** | Azul `#1F96F7` |
| **Cor secundária escura** | Azul escuro `#0057B4` |
| **Cor secundária clara** | Azul claro `#34B8F8` |
| **Branco** | `#FFFFFF` |
| **Preto** | `#353535` |
| **Fonte** | Poppins (Google Fonts) |
| **Logo** | Pássaro origami azul (`Logo Icon.webp`) |
| **Favicon** | Pássaro origami azul simplificado (`favicon.webp`) |

### Diretrizes de Design

- Páginas rápidas e leves — performance é prioridade
- Gradientes (azul principal → azul escuro)
- Backgrounds modernos e bonitos
- Elementos interativos
- Micro-animações ao scroll (fade-in, slide-up)
- Elementos com hover effects, tabs, accordions
- Hub and Spoke Layout para seções informativas (NÃO para formulário ou prova social)
- Interatividade, animações e modernidade = marca Easycao

## 4. Estratégia de Captação

### Funil

```
[Tráfego: YouTube / Instagram / Ads]
         │
         ▼
┌─────────────────────────────────┐
│  Landing Page (/lives)          │
│  Nome / Email / Telefone        │
│  → Mailchimp API (tag: "Lives") │
└────────────┬────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Página de Obrigado                  │
│  (/confirma-cadastro-lives)          │
│  → CTA: Entrar no grupo WhatsApp     │
└──────────────────────────────────────┘
```

### Congruência com Anúncios

Existem 3 anúncios rodando (ver `Roteiro Anúncios.txt`). A landing page deve manter congruência narrativa:

| Anúncio | Mito Derrubado | Verdade Revelada |
|---------|---------------|------------------|
| 1 | "Decorar respostas funciona" | ICAO quer clareza, controle e reação real |
| 2 | "Preciso entender tudo" | Resposta funcional > compreensão total |
| 3 | "Inglês perfeito = nota alta" | É teste de comportamento linguístico sob pressão |

**Padrão narrativo comum:** Mito → Contraste → Conflito → Dor emocional → Verdade → Ponte → CTA

A headline e copy da página devem funcionar como promessa-mãe que sustente qualquer narrativa dos anúncios, inclusive futuros.

## 5. Estrutura das Páginas

### 5.1 Landing Page (`/lives`)

#### Header
- Logo Easycao
- Badge "100% Gratuito"

#### Hero (gradiente azul #1F96F7 → #0057B4)
- **Headline:** "Domine a prova ICAO. Na prática."
- **Sub-headline:** "Participe das lives semanais gratuitas com aulas ao vivo e simulados da prova ICAO"
- Formulário: Nome / Email / Telefone
- CTA: "QUERO PARTICIPAR DAS LIVES" (ou variação)
- Foto do Prof. Diogo ao lado do formulário
- Credencial: "Diogo Verzola — Examinador ICAO Credenciado | Criador do Método Easycao"

#### Seção: O que você vai aprender (Hub and Spoke Layout)
- Hub central: ícone/ilustração temática ICAO
- Spokes (com animação ao scroll):
  - Como a prova realmente funciona
  - Por que decorar respostas não funciona
  - O que o examinador realmente avalia
  - Como responder sem entender tudo

#### Seção: Sobre as Lives
- Cards com hover effect:
  - 📅 Terça 19h (Brasília) — Aula ao vivo no Instagram
  - 📅 Quinta 13h30 (Brasília) — Simulado ICAO no YouTube
- **Countdown dinâmico** para a próxima live:
  - Antes de terça 19h → countdown aponta para terça 19h
  - Entre terça 19h e quinta 13:30 → aponta para quinta 13:30
  - Após quinta 13:30 → aponta para terça 19h da semana seguinte
  - Timezone: `America/Sao_Paulo` (UTC-3)
  - Formato: dias, horas, minutos, segundos
  - Label identificando qual live vem a seguir

#### Seção: Quem é o Prof. Diogo (credibilidade)
- Foto do professor
- Bio curta
- Badges: Examinador ICAO Credenciado | Criador do Método Easycao

#### Seção: Aprovações (+100)
- **Carousel infinito** (marquee/ticker animado)
  - Scroll automático contínuo, loop infinito
  - Imagens uma ao lado da outra
  - Hover pausa a animação
  - Arrastar para navegar
- Texto abaixo: **"Te desafio a ver todas as aprovações"**
- Referência de imagem: `Aprovações/1.png` (formato retrato, resultado Santos Dumont English Assessment)

#### Seção: Depoimentos
- Prints de pessoas que passaram com conteúdo gratuito (lives/vídeos)
- Grid ou carousel com micro-animação ao scroll

#### Seção: CTA Final (repetição)
- Headline de reforço
- Formulário repetido ou âncora para o hero
- CTA de fechamento

#### Footer
- Logo Easycao
- "Easycao © 2026"

### 5.2 Página de Obrigado (`/confirma-cadastro-lives`)

- Animação de celebração (confetti ou similar)
- Headline: "Cadastro confirmado!"
- Texto: "Agora entre no grupo do WhatsApp para receber os avisos das lives ao vivo"
- **Botão verde:** "ENTRAR NO GRUPO DO WHATSAPP"
  - Link: `https://chat.whatsapp.com/BqNohPkBOY4DAD2T95vxpu`
- Reforço visual dos horários:
  - Terça 19h — Instagram
  - Quinta 13h30 — YouTube

## 6. Integrações

### Mailchimp (API v3 — server-side)
- **API Key:** (stored in `.env.local`, not in repo)
- **Server prefix:** `us8`
- **Audience ID:** (stored in `.env.local`, not in repo)
- **Tag:** `Lives`
- Campos: FNAME (nome), EMAIL, PHONE (telefone)
- Integração server-side via API Route (não expor chave no client)

### Google Tag Manager
- **GTM Web:** `GTM-PDLS5SL`
- **GTM Server:** `GTM-NR52FKV3`
- Container GTM no `<head>` + noscript no `<body>`

### WhatsApp
- Link do grupo: `https://chat.whatsapp.com/BqNohPkBOY4DAD2T95vxpu`
- Usado apenas na página de obrigado

## 7. Infraestrutura & Deploy

| Camada | Decisão | Justificativa |
|--------|---------|---------------|
| **Framework** | Next.js (App Router) | Componentes reutilizáveis, site vai crescer com mais páginas |
| **Estilo** | Tailwind CSS | Prototipação rápida, responsivo nativo, build otimizado |
| **Formulário** | Mailchimp API v3 (API Route server-side) | Segurança da API key |
| **Analytics** | GTM Web + Server | Flexibilidade para GA4/Meta Pixel/etc |
| **Deploy** | Vercel (futuro) | Token já configurado, CDN global, SSL grátis |
| **Domínio** | easycao.com → Vercel (futuro) | CNAME no painel HostGator |

**Fase 1 (agora):** Desenvolvimento local com `npm run dev` → iterar até aprovação visual
**Fase 2 (depois):** Deploy Vercel + configuração DNS easycao.com

### Configuração DNS
- Domínio: `easycao.com` (registrado na Umbler, DNS no HostGator)
- Nameservers atuais: `ns398.hostgator.com.br` / `ns399.hostgator.com.br`
- Ação: Adicionar CNAME record apontando para `cname.vercel-dns.com`
- HostGator Plano M mantido para outros usos

## 8. Assets do Projeto

### Disponíveis
- [x] Logo (`Logo Icon.webp`)
- [x] Favicon (`favicon.webp`)
- [x] Roteiro dos anúncios (`Roteiro Anúncios.txt`)
- [x] Aprovação modelo (`Aprovações/1.png`) — usar como placeholder

### Pendentes (serão adicionados pelo cliente)
- [ ] Fotos do Prof. Diogo Verzola
- [ ] +100 imagens de aprovações ICAO (mesma resolução de `Aprovações/1.png`)
- [ ] Prints de depoimentos — pessoas que passaram com conteúdo gratuito

## 9. Requisitos Técnicos

- **Performance:** Páginas rápidas e leves — LCP < 2.5s, CLS < 0.1
- **Responsivo:** Mobile-first (maioria do tráfego vem de Instagram/YouTube mobile)
- **SEO:** Meta tags, Open Graph, structured data básico
- **Acessibilidade:** Contraste adequado, labels nos inputs, navegação por teclado
- **Countdown:** Dinâmico, timezone-aware (America/Sao_Paulo)
- **Carousel de aprovações:** CSS-based para performance (não JS pesado)
- **Animações:** Intersection Observer para trigger ao scroll, CSS transitions/animations preferencialmente

## 10. Referência Estratégica

- **Modelo de captação:** Similar a Pedro Sobral (`pedrosobral.com.br/lives-semanais/cadastro/org-b`)
- **O que absorver:** Countdown, foto do instrutor no hero, formulário simples, credenciais, CTAs repetidos
- **O que superar:** Design significativamente mais moderno, com gradientes, animações e interatividade

## 11. Handoff — Próximos Agentes

| Ordem | Agente | Ação |
|-------|--------|------|
| 1 | @architect | Definir arquitetura técnica (Next.js + Tailwind + Vercel) |
| 2 | @ux-design-expert | Wireframe detalhado + copy final das seções |
| 3 | @sm | Criar stories de desenvolvimento |
| 4 | @dev | Implementar páginas, integrações, animações |
| 5 | @qa | Validar funcionalidade, responsividade, performance |
| 6 | @devops | Deploy no Vercel + configuração DNS easycao.com |

---

*Project Brief criado por Atlas (@analyst) — Synkra AIOS*
