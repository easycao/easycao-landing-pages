# Wireframes High-Fidelity — Easycao Landing Page

**Autor:** Uma (@ux-design-expert)
**Data:** 2026-03-02
**Fidelidade:** High
**Páginas:** 2 (`/lives` + `/confirma-cadastro-lives`)

---

## 1. Landing Page — `/lives`

### 1.1 Desktop (>1024px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                          max-w:1280  │
│                                                                             │
│  [Logo Easycao]                              [Badge: 100% GRATUITO]         │
│   pássaro origami                              bg:#34B8F8 text:#fff         │
│   + "Easycao" text                             rounded-full, px-4 py-1      │
│                                                                             │
│  bg: #FFFFFF | border-bottom: 1px solid #E5E7EB | sticky top-0 z-50        │
│  padding: 16px 0 | backdrop-blur                                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ HERO SECTION                                                                │
│ bg: gradient linear(135deg, #1F96F7 0%, #0057B4 100%)                       │
│ padding: 80px 0 | min-height: 90vh                                          │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────┐      │
│  │ COLUNA ESQUERDA (55%)           │  │ COLUNA DIREITA (45%)         │      │
│  │                                 │  │                              │      │
│  │ [Headline - Poppins 700]        │  │  ┌────────────────────────┐  │      │
│  │ "Domine a prova ICAO."         │  │  │  FORMULÁRIO             │  │      │
│  │  font-size: 48px               │  │  │  bg: #FFFFFF            │  │      │
│  │  color: #FFFFFF                 │  │  │  rounded-2xl            │  │      │
│  │  line-height: 1.1              │  │  │  shadow-2xl             │  │      │
│  │                                 │  │  │  padding: 40px 32px     │  │      │
│  │ "Na prática."                   │  │  │                        │  │      │
│  │  font-size: 48px               │  │  │  "Cadastre-se e         │  │      │
│  │  color: #34B8F8                 │  │  │   participe das lives"  │  │      │
│  │  (cor clara = destaque)         │  │  │  Poppins 600 18px      │  │      │
│  │                                 │  │  │  color: #353535        │  │      │
│  │ [Sub-headline - Poppins 400]    │  │  │                        │  │      │
│  │ "Participe das lives semanais"  │  │  │  ┌──────────────────┐  │  │      │
│  │ "gratuitas com aulas ao vivo"   │  │  │  │ 👤 Seu nome      │  │  │      │
│  │ "e simulados da prova ICAO"     │  │  │  └──────────────────┘  │  │      │
│  │  font-size: 20px               │  │  │  ┌──────────────────┐  │  │      │
│  │  color: #FFFFFF/80             │  │  │  │ ✉️  Seu email     │  │  │      │
│  │  margin-top: 24px              │  │  │  └──────────────────┘  │  │      │
│  │                                 │  │  │  ┌──────────────────┐  │  │      │
│  │ ┌─────────────────────────┐     │  │  │  │ 📱 Seu telefone  │  │  │      │
│  │ │ FOTO PROF. DIOGO        │     │  │  │  └──────────────────┘  │  │      │
│  │ │                         │     │  │  │                        │  │      │
│  │ │  [Foto recortada]       │     │  │  │  ┌──────────────────┐  │  │      │
│  │ │   from waist up         │     │  │  │  │ QUERO PARTICIPAR │  │  │      │
│  │ │   transparent bg or     │     │  │  │  │    DAS LIVES     │  │  │      │
│  │ │   integrated with       │     │  │  │  │                  │  │  │      │
│  │ │   gradient              │     │  │  │  │  bg: #34B8F8     │  │  │      │
│  │ │                         │     │  │  │  │  hover: #1F96F7  │  │  │      │
│  │ │                         │     │  │  │  │  Poppins 700     │  │  │      │
│  │ │                         │     │  │  │  │  16px uppercase  │  │  │      │
│  │ └─────────────────────────┘     │  │  │  │  rounded-xl      │  │  │      │
│  │                                 │  │  │  │  py-4 w-full     │  │  │      │
│  │ [Credential Badge]              │  │  │  │  shadow-lg       │  │  │      │
│  │  "Diogo Verzola"               │  │  │  │  hover:scale(1.02)│  │  │      │
│  │  "Examinador ICAO Credenciado" │  │  │  │  transition 300ms│  │  │      │
│  │  "Criador do Método Easycao"   │  │  │  └──────────────────┘  │  │      │
│  │  Poppins 500 14px              │  │  │                        │  │      │
│  │  color: #FFFFFF                 │  │  │  "Seus dados estão"   │  │      │
│  │  bg: #FFFFFF/10 backdrop-blur   │  │  │  "seguros conosco 🔒" │  │      │
│  │  rounded-lg px-4 py-3          │  │  │  text-xs color:#999   │  │      │
│  │                                 │  │  └────────────────────────┘  │      │
│  └─────────────────────────────────┘  └──────────────────────────────┘      │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ SEÇÃO: O QUE VOCÊ VAI APRENDER (Hub and Spoke)                              │
│ bg: #FFFFFF | padding: 80px 0                                               │
│                                                                             │
│  [Section Title - Poppins 700 36px color:#353535]                           │
│  "O que você vai aprender nas lives"                                        │
│  text-center | mb-48                                                        │
│                                                                             │
│              ┌──────────┐                                                   │
│              │          │ ← Spoke 1 (animação: fade-in-right ao scroll)     │
│              │  HUB     │   ┌─────────────────────────────────────┐         │
│  Spoke 4 ←  │ CENTRAL  │   │ "Como a prova realmente funciona"    │         │
│              │          │   │ Descrição curta 2 linhas             │         │
│              │ [Ícone   │   │ ícone + bg:#F0F9FF rounded-xl p-6   │         │
│              │  avião/  │   └─────────────────────────────────────┘         │
│              │  ICAO    │                                                   │
│              │  badge]  │                                                   │
│              │          │ ← Spoke 2 (animação: fade-in-right delay 150ms)   │
│              │ bg:      │   ┌─────────────────────────────────────┐         │
│  Spoke 3 ←  │ gradient │   │ "Por que decorar respostas não       │         │
│              │ circle   │   │  funciona no ICAO"                   │         │
│              │ #1F96F7→ │   │ Descrição curta 2 linhas             │         │
│              │ #0057B4  │   │ ícone + bg:#F0F9FF rounded-xl p-6   │         │
│              │          │   └─────────────────────────────────────┘         │
│              └──────────┘                                                   │
│                                                                             │
│  ┌─────────────────────────────────────┐                                    │
│  │ Spoke 3: "O que o examinador        │                                    │
│  │  realmente avalia"                  │  (animação: fade-in-left)          │
│  │ ícone + bg:#F0F9FF rounded-xl p-6   │                                    │
│  └─────────────────────────────────────┘                                    │
│                                                                             │
│  ┌─────────────────────────────────────┐                                    │
│  │ Spoke 4: "Como responder bem sem    │                                    │
│  │  entender tudo"                     │  (animação: fade-in-left)          │
│  │ ícone + bg:#F0F9FF rounded-xl p-6   │                                    │
│  └─────────────────────────────────────┘                                    │
│                                                                             │
│  LAYOUT: Hub centralizado, spokes posicionados ao redor                     │
│  Desktop: hub centro, 2 spokes esquerda, 2 spokes direita                  │
│  Linhas conectoras SVG animadas ligando hub aos spokes                      │
│  Cada spoke aparece com Intersection Observer (stagger 150ms)               │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ SEÇÃO: SOBRE AS LIVES + COUNTDOWN                                           │
│ bg: gradient linear(135deg, #0057B4 0%, #1F96F7 100%)                       │
│ padding: 80px 0                                                             │
│                                                                             │
│  [Section Title - Poppins 700 36px color:#FFF]                              │
│  "Lives semanais gratuitas"                                                 │
│  text-center | mb-48                                                        │
│                                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐         │
│  │ CARD LIVE 1                  │  │ CARD LIVE 2                  │         │
│  │ bg: #FFFFFF/10               │  │ bg: #FFFFFF/10               │         │
│  │ backdrop-blur                │  │ backdrop-blur                │         │
│  │ border: 1px solid #FFF/20   │  │ border: 1px solid #FFF/20   │         │
│  │ rounded-2xl p-8             │  │ rounded-2xl p-8             │         │
│  │ hover:bg:#FFFFFF/20         │  │ hover:bg:#FFFFFF/20         │         │
│  │ hover:scale(1.02)           │  │ hover:scale(1.02)           │         │
│  │ transition: 300ms           │  │ transition: 300ms           │         │
│  │                              │  │                              │         │
│  │ [Ícone Instagram]            │  │ [Ícone YouTube]              │         │
│  │  48px color: #FFF           │  │  48px color: #FFF           │         │
│  │                              │  │                              │         │
│  │ "Aula ao Vivo"               │  │ "Simulado ICAO"              │         │
│  │  Poppins 700 24px #FFF      │  │  Poppins 700 24px #FFF      │         │
│  │                              │  │                              │         │
│  │ "Terça-feira"                │  │ "Quinta-feira"               │         │
│  │  Poppins 500 16px #FFF/80   │  │  Poppins 500 16px #FFF/80   │         │
│  │                              │  │                              │         │
│  │ "19h (Brasília)"             │  │ "13h30 (Brasília)"           │         │
│  │  Poppins 700 20px #34B8F8   │  │  Poppins 700 20px #34B8F8   │         │
│  │                              │  │                              │         │
│  │ "Explicação da prova do zero │  │ "Prova aplicada ao vivo com  │         │
│  │  + tira dúvidas ao vivo"     │  │  simulador ICAO + correção"  │         │
│  │  Poppins 400 14px #FFF/70   │  │  Poppins 400 14px #FFF/70   │         │
│  └──────────────────────────────┘  └──────────────────────────────┘         │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ COUNTDOWN — PRÓXIMA LIVE                                     │           │
│  │ bg: #FFFFFF rounded-2xl shadow-2xl p-10 mt-48               │           │
│  │ text-center                                                  │           │
│  │                                                              │           │
│  │ "Próxima live:"                                              │           │
│  │  Poppins 500 16px color:#353535/60                           │           │
│  │                                                              │           │
│  │ "🔴 Aula ao Vivo — Terça 19h" (ou "Simulado ICAO...")       │           │
│  │  Poppins 600 20px color:#1F96F7                              │           │
│  │  (dinâmico: muda conforme próxima live)                      │           │
│  │                                                              │           │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐             │           │
│  │  │   02   │  │   14   │  │   37   │  │   52   │             │           │
│  │  │  DIAS  │  │ HORAS  │  │  MIN   │  │  SEG   │             │           │
│  │  └────────┘  └────────┘  └────────┘  └────────┘             │           │
│  │                                                              │           │
│  │  Números: Poppins 800 48px color:#0057B4                     │           │
│  │  Labels: Poppins 500 12px color:#353535/50 uppercase          │           │
│  │  Cada bloco: bg:#F0F9FF rounded-xl px-6 py-4                │           │
│  │  Separador ":" entre blocos, animação pulse nos segundos     │           │
│  │  Timezone: America/Sao_Paulo (UTC-3)                         │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ SEÇÃO: QUEM É O PROFESSOR DIOGO (Credibilidade)                             │
│ bg: #FFFFFF | padding: 80px 0                                               │
│                                                                             │
│  ┌──────────────────────┐  ┌─────────────────────────────────────────┐      │
│  │                      │  │                                         │      │
│  │  [FOTO DIOGO]        │  │  "Quem vai te preparar"                 │      │
│  │                      │  │   Poppins 500 14px #1F96F7 uppercase    │      │
│  │   Foto grande        │  │   letter-spacing: 2px                   │      │
│  │   rounded-2xl        │  │                                         │      │
│  │   aspect-ratio: 3/4  │  │  "Diogo Verzola"                        │      │
│  │   object-fit: cover  │  │   Poppins 700 36px #353535              │      │
│  │   shadow-xl          │  │                                         │      │
│  │                      │  │  [Bio - 3 a 4 linhas]                   │      │
│  │                      │  │   Poppins 400 16px #353535/80           │      │
│  │                      │  │   line-height: 1.7                      │      │
│  │                      │  │                                         │      │
│  │                      │  │  ┌────────────────┐ ┌────────────────┐  │      │
│  │                      │  │  │ ✅ Examinador   │ │ ✅ Criador do   │  │      │
│  │                      │  │  │ ICAO            │ │ Método Easycao │  │      │
│  │                      │  │  │ Credenciado     │ │                │  │      │
│  │                      │  │  └────────────────┘ └────────────────┘  │      │
│  │                      │  │                                         │      │
│  │                      │  │  Badges: bg:#F0F9FF border:#1F96F7/20   │      │
│  │                      │  │  rounded-lg px-4 py-3                   │      │
│  │                      │  │  Poppins 500 14px color:#0057B4         │      │
│  └──────────────────────┘  └─────────────────────────────────────────┘      │
│                                                                             │
│  Layout: 2 colunas (40% foto / 60% texto)                                  │
│  Animação: foto slide-in-left, texto fade-in-right (Intersection Observer)  │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ SEÇÃO: APROVAÇÕES (+100) — Carousel Infinito                                │
│ bg: #F8FAFC | padding: 80px 0 | overflow: hidden                           │
│                                                                             │
│  [Section Title - Poppins 700 36px color:#353535]                           │
│  "+100 aprovações de alunos Easycao"                                        │
│  text-center | mb-12                                                        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ CAROUSEL ROW 1 (→ direita)                                          │   │
│  │                                                                      │   │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────  │   │
│  │ │ Aprov.  │ │ Aprov.  │ │ Aprov.  │ │ Aprov.  │ │ Aprov.  │ │ ... │   │
│  │ │  01     │ │  02     │ │  03     │ │  04     │ │  05     │ │     │   │
│  │ │         │ │         │ │         │ │         │ │         │ │     │   │
│  │ │ Santos  │ │ Santos  │ │ Santos  │ │ Santos  │ │ Santos  │ │     │   │
│  │ │ Dumont  │ │ Dumont  │ │ Dumont  │ │ Dumont  │ │ Dumont  │ │     │   │
│  │ │ Assess. │ │ Assess. │ │ Assess. │ │ Assess. │ │ Assess. │ │     │   │
│  │ │ Nível 5 │ │ Nível 4 │ │ Nível 5 │ │ Nível 4 │ │ Nível 5 │ │     │   │
│  │ │         │ │         │ │         │ │         │ │         │ │     │   │
│  │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────  │   │
│  │                                                                      │   │
│  │ Scroll automático contínuo → (CSS animation: marquee)                │   │
│  │ Velocidade: ~40px/s | Hover: pausa | Drag: navegar manual           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ CAROUSEL ROW 2 (← esquerda) — direção oposta para efeito visual     │   │
│  │                                                                      │   │
│  │ ────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │   │
│  │ ... │ │ Aprov.  │ │ Aprov.  │ │ Aprov.  │ │ Aprov.  │ │ Aprov.  │ │   │
│  │     │ │  51     │ │  52     │ │  53     │ │  54     │ │  55     │ │   │
│  │     │ │         │ │         │ │         │ │         │ │         │ │   │
│  │ ────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │   │
│  │                                                                      │   │
│  │ Scroll automático contínuo ← (CSS animation: marquee-reverse)       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Cada imagem: rounded-xl shadow-md | width: ~200px | gap: 16px            │
│  Hover individual: scale(1.05) shadow-xl transition 300ms                  │
│                                                                             │
│  "Te desafio a ver todas as aprovações"                                     │
│   Poppins 600 18px color:#1F96F7 text-center mt-8                          │
│   (com emoji ou ícone de troféu opcional)                                   │
│                                                                             │
│  TÉCNICA: CSS @keyframes marquee, duplicar array de imagens para loop      │
│  contínuo sem gap. Duas rows em direções opostas = efeito visual forte.    │
│  Performance: will-change: transform, prefer GPU acceleration              │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ SEÇÃO: DEPOIMENTOS                                                          │
│ bg: #FFFFFF | padding: 80px 0                                               │
│                                                                             │
│  [Section Title - Poppins 700 36px color:#353535]                           │
│  "Resultados com conteúdo gratuito"                                         │
│  text-center | mb-48                                                        │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ DEPOIMENTO 1    │  │ DEPOIMENTO 2    │  │ DEPOIMENTO 3    │             │
│  │                 │  │                 │  │                 │             │
│  │ [Screenshot]    │  │ [Screenshot]    │  │ [Screenshot]    │             │
│  │ do print com    │  │ do print com    │  │ do print com    │             │
│  │ mensagem do     │  │ mensagem do     │  │ mensagem do     │             │
│  │ aluno           │  │ aluno           │  │ aluno           │             │
│  │                 │  │                 │  │                 │             │
│  │ bg:#FFF         │  │ bg:#FFF         │  │ bg:#FFF         │             │
│  │ border:1px      │  │ border:1px      │  │ border:1px      │             │
│  │ #E5E7EB         │  │ #E5E7EB         │  │ #E5E7EB         │             │
│  │ rounded-xl      │  │ rounded-xl      │  │ rounded-xl      │             │
│  │ shadow-sm       │  │ shadow-sm       │  │ shadow-sm       │             │
│  │ hover:shadow-lg │  │ hover:shadow-lg │  │ hover:shadow-lg │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  Layout: Grid 3 colunas desktop | 1 coluna mobile (scroll horizontal)      │
│  Animação: fade-in staggered ao scroll (150ms entre cards)                 │
│  Se mais de 3: carousel com dots de navegação                              │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ SEÇÃO: CTA FINAL (Repetição do formulário)                                  │
│ bg: gradient linear(135deg, #1F96F7 0%, #0057B4 100%)                       │
│ padding: 80px 0                                                             │
│                                                                             │
│  [Headline de reforço - Poppins 700 36px color:#FFF text-center]            │
│  "Não perca a próxima live"                                                 │
│                                                                             │
│  [Sub - Poppins 400 18px color:#FFF/80 text-center]                         │
│  "Cadastre-se agora e entre no grupo para ser avisado"                      │
│                                                                             │
│  ┌────────────────────────────────────────────┐                             │
│  │ FORMULÁRIO (centralizado, max-w: 480px)    │                             │
│  │ bg: #FFFFFF rounded-2xl shadow-2xl p-10    │                             │
│  │                                            │                             │
│  │  ┌──────────────────────────────────────┐  │                             │
│  │  │ 👤 Seu nome                          │  │                             │
│  │  └──────────────────────────────────────┘  │                             │
│  │  ┌──────────────────────────────────────┐  │                             │
│  │  │ ✉️  Seu email                        │  │                             │
│  │  └──────────────────────────────────────┘  │                             │
│  │  ┌──────────────────────────────────────┐  │                             │
│  │  │ 📱 Seu telefone                      │  │                             │
│  │  └──────────────────────────────────────┘  │                             │
│  │                                            │                             │
│  │  ┌──────────────────────────────────────┐  │                             │
│  │  │    GARANTIR MINHA VAGA NAS LIVES     │  │                             │
│  │  └──────────────────────────────────────┘  │                             │
│  │                                            │                             │
│  │  "Seus dados estão seguros conosco 🔒"    │                             │
│  └────────────────────────────────────────────┘                             │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                      │
│ bg: #353535 | padding: 32px 0                                               │
│                                                                             │
│  [Logo Easycao branco/claro]     "Easycao © 2026. Todos os direitos        │
│                                   reservados."                              │
│                                   Poppins 400 14px color:#FFF/60           │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Mobile (<640px)

```
┌────────────────────────────────┐
│ HEADER (sticky)                │
│ [Logo]        [100% GRATUITO]  │
│ h-16 px-4                      │
└────────────────────────────────┘

┌────────────────────────────────┐
│ HERO (gradient)                │
│ padding: 48px 20px             │
│ text-align: center             │
│                                │
│ "Domine a prova ICAO."        │
│  32px Poppins 700 #FFF         │
│ "Na prática."                  │
│  32px Poppins 700 #34B8F8      │
│                                │
│ "Participe das lives semanais" │
│ "gratuitas com aulas ao vivo"  │
│ "e simulados da prova ICAO"   │
│  16px Poppins 400 #FFF/80      │
│                                │
│ [FOTO DIOGO - centralizada]    │
│  width: 200px rounded-full     │
│                                │
│ "Diogo Verzola"                │
│ "Examinador ICAO Credenciado"  │
│  14px center                   │
│                                │
│ ┌────────────────────────────┐ │
│ │ FORMULÁRIO                 │ │
│ │ bg:#FFF rounded-2xl p-6    │ │
│ │                            │ │
│ │ "Cadastre-se e participe"  │ │
│ │                            │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ 👤 Seu nome            │ │ │
│ │ └────────────────────────┘ │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ ✉️  Seu email          │ │ │
│ │ └────────────────────────┘ │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ 📱 Seu telefone        │ │ │
│ │ └────────────────────────┘ │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ QUERO PARTICIPAR       │ │ │
│ │ │    DAS LIVES           │ │ │
│ │ └────────────────────────┘ │ │
│ │ "Dados seguros 🔒"        │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘

┌────────────────────────────────┐
│ HUB & SPOKE (mobile: stacked)  │
│ padding: 48px 20px             │
│                                │
│ "O que você vai aprender"      │
│  24px center                   │
│                                │
│ [Hub icon centralizado]        │
│                                │
│ ┌────────────────────────────┐ │
│ │ Spoke 1 (card empilhado)   │ │
│ │ ícone + texto              │ │
│ │ bg:#F0F9FF rounded-xl p-5  │ │
│ └────────────────────────────┘ │
│          8px gap               │
│ ┌────────────────────────────┐ │
│ │ Spoke 2                    │ │
│ └────────────────────────────┘ │
│          8px gap               │
│ ┌────────────────────────────┐ │
│ │ Spoke 3                    │ │
│ └────────────────────────────┘ │
│          8px gap               │
│ ┌────────────────────────────┐ │
│ │ Spoke 4                    │ │
│ └────────────────────────────┘ │
│                                │
│ Mobile: layout vertical stack  │
│ Linhas SVG omitidas no mobile  │
│ Cards aparecem staggered       │
└────────────────────────────────┘

┌────────────────────────────────┐
│ LIVES + COUNTDOWN (gradient)   │
│ padding: 48px 20px             │
│                                │
│ "Lives semanais gratuitas"     │
│  24px center #FFF              │
│                                │
│ ┌────────────────────────────┐ │
│ │ [IG] Aula ao Vivo          │ │
│ │ Terça — 19h (Brasília)     │ │
│ │ glass card                 │ │
│ └────────────────────────────┘ │
│         12px gap               │
│ ┌────────────────────────────┐ │
│ │ [YT] Simulado ICAO         │ │
│ │ Quinta — 13h30 (Brasília)  │ │
│ │ glass card                 │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ COUNTDOWN                  │ │
│ │ ┌────┐┌────┐┌────┐┌────┐  │ │
│ │ │ 02 ││ 14 ││ 37 ││ 52 │  │ │
│ │ │DIAS││HORA││MIN ││SEG │  │ │
│ │ └────┘└────┘└────┘└────┘  │ │
│ │ Números: 32px mobile       │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘

┌────────────────────────────────┐
│ PROF. DIOGO (mobile: stacked)  │
│ padding: 48px 20px             │
│                                │
│ "Quem vai te preparar"         │
│ "Diogo Verzola"                │
│                                │
│ [Foto centralizada]            │
│  w-full max-w:300px            │
│  rounded-2xl                   │
│                                │
│ [Bio texto]                    │
│                                │
│ [Badge 1] [Badge 2]            │
│  stack vertical on small       │
└────────────────────────────────┘

┌────────────────────────────────┐
│ APROVAÇÕES (mobile)            │
│ padding: 48px 0                │
│ overflow: hidden               │
│                                │
│ "+100 aprovações"              │
│  24px center                   │
│                                │
│ ← [img][img][img][img]... →    │
│   Row 1: scroll →              │
│                                │
│ ← ...[img][img][img][img] →    │
│   Row 2: scroll ←              │
│                                │
│ Imagens: width ~140px mobile   │
│ "Te desafio a ver todas"       │
└────────────────────────────────┘

┌────────────────────────────────┐
│ DEPOIMENTOS (mobile)           │
│ horizontal scroll              │
│                                │
│ "Resultados com conteúdo"      │
│ "gratuito"                     │
│                                │
│ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │ dep1 │ │ dep2 │ │ dep3 │ →  │
│ └──────┘ └──────┘ └──────┘    │
│  snap-x scroll-smooth         │
│  dots indicator abaixo         │
└────────────────────────────────┘

┌────────────────────────────────┐
│ CTA FINAL (gradient)           │
│ [Formulário full-width]        │
│ Mesmo layout do hero form      │
│ CTA: "GARANTIR MINHA VAGA"     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ FOOTER                         │
│ [Logo] © 2026                  │
└────────────────────────────────┘
```

---

## 2. Página de Obrigado — `/confirma-cadastro-lives`

### 2.1 Desktop

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ bg: gradient linear(135deg, #1F96F7 0%, #0057B4 100%)                       │
│ min-height: 100vh                                                           │
│ display: flex, align-items: center, justify-content: center                 │
│                                                                             │
│ [CONFETTI ANIMATION — CSS particles falling from top]                       │
│  Cores dos confettis: #1F96F7, #34B8F8, #0057B4, #FFFFFF                   │
│  Duração: 3s, depois fade out                                               │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ CARD CENTRAL                                                 │           │
│  │ bg: #FFFFFF | rounded-3xl | shadow-2xl                       │           │
│  │ max-width: 560px | padding: 60px 48px | text-center          │           │
│  │                                                              │           │
│  │ [Ícone ✅ ou animação de checkmark]                           │           │
│  │  Lottie animation ou CSS: circle draw + check draw           │           │
│  │  64px, color: #1F96F7                                        │           │
│  │  Animação: aparece após 500ms com bounce                     │           │
│  │                                                              │           │
│  │ "Cadastro confirmado!"                                       │           │
│  │  Poppins 700 32px #353535                                    │           │
│  │  mt-24                                                       │           │
│  │                                                              │           │
│  │ "Agora entre no grupo do WhatsApp"                           │           │
│  │ "para receber os avisos das lives"                           │           │
│  │  Poppins 400 18px #353535/70                                 │           │
│  │  mt-12                                                       │           │
│  │                                                              │           │
│  │ ┌──────────────────────────────────────────────────────┐     │           │
│  │ │                                                      │     │           │
│  │ │  [WhatsApp icon]  ENTRAR NO GRUPO DO WHATSAPP        │     │           │
│  │ │                                                      │     │           │
│  │ │  bg: #25D366 (verde WhatsApp)                        │     │           │
│  │ │  hover: #1DA851                                      │     │           │
│  │ │  color: #FFFFFF                                      │     │           │
│  │ │  Poppins 700 16px uppercase                          │     │           │
│  │ │  rounded-xl py-5 px-8                                │     │           │
│  │ │  shadow-lg                                           │     │           │
│  │ │  hover:scale(1.03) transition 300ms                  │     │           │
│  │ │  animate: subtle pulse every 2s (chamar atenção)     │     │           │
│  │ └──────────────────────────────────────────────────────┘     │           │
│  │                                                              │           │
│  │ ─────────────── divider ───────────────                      │           │
│  │                                                              │           │
│  │ "Horários das lives:"                                        │           │
│  │  Poppins 600 14px #353535/50                                 │           │
│  │                                                              │           │
│  │  📅 Terça 19h — Aula ao vivo (Instagram)                     │           │
│  │  📅 Quinta 13h30 — Simulado ICAO (YouTube)                   │           │
│  │  Poppins 400 14px #353535/60                                 │           │
│  │                                                              │           │
│  │ [Logo Easycao small]                                         │           │
│  │  opacity: 0.5 | mt-32                                        │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Mobile

```
┌────────────────────────────────┐
│ bg: gradient                   │
│ min-h: 100vh                   │
│ flex center                    │
│ px-5 py-12                     │
│                                │
│ [confetti animation]           │
│                                │
│ ┌────────────────────────────┐ │
│ │ CARD                       │ │
│ │ rounded-2xl p-8            │ │
│ │ text-center                │ │
│ │                            │ │
│ │ [✅ check animation]       │ │
│ │  48px                      │ │
│ │                            │ │
│ │ "Cadastro confirmado!"     │ │
│ │  24px Poppins 700          │ │
│ │                            │ │
│ │ "Agora entre no grupo do"  │ │
│ │ "WhatsApp para receber"    │ │
│ │ "os avisos das lives"      │ │
│ │  16px                      │ │
│ │                            │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ [WA] ENTRAR NO GRUPO  │ │ │
│ │ │   DO WHATSAPP          │ │ │
│ │ │ bg: #25D366            │ │ │
│ │ │ py-4 w-full            │ │ │
│ │ │ pulse animation        │ │ │
│ │ └────────────────────────┘ │ │
│ │                            │ │
│ │ ──── divider ────          │ │
│ │                            │ │
│ │ 📅 Terça 19h — Instagram   │ │
│ │ 📅 Quinta 13h30 — YouTube  │ │
│ │                            │ │
│ │ [Logo small]               │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

---

## 3. Interaction Flow

```
[Tráfego: YouTube/Instagram/Ads]
        │
        ▼
┌─────────────────────┐
│  /lives             │
│  (Landing Page)     │
└────────┬────────────┘
         │
         ├── Scroll → Seções informativas (Hub&Spoke, Lives, Diogo, Aprovações)
         │
         ├── Preenche formulário (Hero ou CTA Final)
         │      │
         │      ├── Validação client-side
         │      │     ├── Nome: required, min 2 chars
         │      │     ├── Email: required, format válido
         │      │     └── Telefone: required, format BR
         │      │
         │      ├── [Inválido] → Shake animation + mensagem erro inline
         │      │
         │      └── [Válido] → Submit
         │             │
         │             ├── Loading: botão disabled + spinner
         │             │
         │             ├── POST /api/subscribe
         │             │     │
         │             │     ├── Mailchimp API v3
         │             │     │   ├── Add/update member
         │             │     │   ├── Set tag "Lives"
         │             │     │   └── Fields: FNAME, EMAIL, PHONE
         │             │     │
         │             │     ├── [Sucesso] → redirect /confirma-cadastro-lives
         │             │     │
         │             │     └── [Erro] → Toast error "Tente novamente"
         │             │           └── Re-enable form
         │             │
         │             └── GTM dataLayer.push({event: 'lead_capture'})
         │
         └── Countdown → Atualiza em tempo real (setInterval 1s)
                └── Lógica timezone: America/Sao_Paulo
                      ├── Antes terça 19h → "Aula ao Vivo — Terça 19h"
                      ├── Terça 19h ~ Quinta 13:30 → "Simulado ICAO — Quinta 13h30"
                      └── Após quinta 13:30 → "Aula ao Vivo — Terça 19h" (próx semana)


┌──────────────────────────────┐
│  /confirma-cadastro-lives    │
│  (Thank You Page)            │
└──────────────┬───────────────┘
               │
               ├── Confetti animation (auto, 3s)
               ├── Check animation (500ms delay)
               │
               └── Click "Entrar no grupo"
                     │
                     ├── GTM dataLayer.push({event: 'whatsapp_click'})
                     │
                     └── window.open('https://chat.whatsapp.com/BqNohPkBOY4DAD2T95vxpu')
                           └── target: _blank
```

---

## 4. Component Inventory (Atomic Design)

### Atoms (9)

| Componente | Props | Variantes |
|-----------|-------|-----------|
| Button | label, variant, size, disabled, loading | primary, whatsapp, ghost |
| Input | type, placeholder, icon, error, value | text, email, tel |
| Label | text, htmlFor | default |
| Badge | text, variant | gradient, outline, success |
| Icon | name, size, color | instagram, youtube, whatsapp, check, lock, user, mail, phone, plane |
| Logo | variant, size | full, icon-only |
| CountdownDigit | value, label | days, hours, minutes, seconds |
| SectionTitle | text, subtitle, variant | light (white), dark (#353535) |
| Divider | variant | line, gradient |

### Molecules (7)

| Componente | Composição | Notas |
|-----------|-----------|-------|
| FormField | Label + Input + ErrorMessage | Validação inline |
| LiveCard | Icon + Title + Day + Time + Description | Glass morphism card |
| CredentialBadge | Icon(check) + Text | Bg azul claro |
| CountdownTimer | 4x CountdownDigit + Label dinâmico | Lógica timezone |
| SpokeCard | Icon + Title + Description | Hub&Spoke item |
| TestimonialCard | Image + Border | Hover effect |
| ApprovalImage | Image + rounded + shadow | Para carousel |

### Organisms (6)

| Componente | Composição | Notas |
|-----------|-----------|-------|
| Header | Logo + Badge | Sticky, backdrop-blur |
| HeroSection | Headline + Sub + Photo + Form + Credential | Split layout desktop |
| LeadForm | 3x FormField + Button + SecurityText | Reutilizado 2x na página |
| HubAndSpoke | SectionTitle + HubIcon + 4x SpokeCard + SVG lines | Animação ao scroll |
| ApprovalCarousel | N x ApprovalImage (2 rows, direções opostas) | CSS marquee infinito |
| Footer | Logo + Copyright | Simples |

### Templates (2)

| Template | Organisms | Layout |
|---------|-----------|--------|
| LandingPageTemplate | Header + Hero + HubSpoke + Lives + Professor + Approvals + Testimonials + CTAFinal + Footer | Scroll vertical, seções full-width |
| ThankYouTemplate | Card (check + text + WhatsApp button + schedule) | Centralizado, min-h:100vh |

---

## 5. Spacing & Typography System

### Spacing (base 4px)

| Token | Value | Uso |
|-------|-------|-----|
| space-1 | 4px | Micro gaps |
| space-2 | 8px | Input padding, inline gaps |
| space-3 | 12px | Card internal gaps |
| space-4 | 16px | Between form fields |
| space-5 | 20px | Mobile page padding |
| space-6 | 24px | Between content blocks |
| space-8 | 32px | Section internal padding |
| space-10 | 40px | Form card padding |
| space-12 | 48px | Between sections (mobile) |
| space-20 | 80px | Between sections (desktop) |

### Typography

| Token | Font | Weight | Size Desktop | Size Mobile |
|-------|------|--------|-------------|-------------|
| heading-hero | Poppins | 700 | 48px | 32px |
| heading-section | Poppins | 700 | 36px | 24px |
| heading-card | Poppins | 700 | 24px | 20px |
| body-lg | Poppins | 400 | 20px | 16px |
| body | Poppins | 400 | 16px | 14px |
| body-sm | Poppins | 400 | 14px | 13px |
| caption | Poppins | 500 | 12px | 11px |
| button | Poppins | 700 | 16px | 14px |
| countdown-number | Poppins | 800 | 48px | 32px |

### Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | 1 coluna, stack vertical |
| Tablet | 640px - 1024px | 2 colunas em algumas seções |
| Desktop | > 1024px | Layout completo, max-width 1280px |

---

## 6. Animation Specs

| Elemento | Trigger | Animação | Duração | Delay |
|---------|---------|----------|---------|-------|
| Spoke cards | Intersection Observer | fade-in + slide-up (20px) | 600ms | stagger 150ms |
| Live cards | Intersection Observer | fade-in + scale(0.95→1) | 500ms | 100ms between |
| Prof. Diogo foto | Intersection Observer | slide-in-left | 700ms | 0 |
| Prof. Diogo texto | Intersection Observer | fade-in-right | 700ms | 200ms |
| Approval carousel | Page load | marquee CSS infinite | 40px/s | 0 |
| Testimonial cards | Intersection Observer | fade-in + slide-up | 500ms | stagger 150ms |
| Countdown segundos | setInterval | pulse (scale 1→1.05→1) | 300ms | every 1s |
| CTA button hover | Hover | scale(1→1.02) + shadow increase | 300ms | 0 |
| Form submit error | Validation fail | shake horizontal (5px) | 400ms | 0 |
| Confetti (obrigado) | Page load | particles fall from top | 3000ms | 0 |
| Check icon (obrigado) | Page load | circle draw + check draw | 800ms | 500ms |
| WhatsApp button | Idle | subtle pulse (scale 1→1.03→1) | 2000ms | loop |

---

## 7. GTM Events

| Evento | Trigger | Dados |
|--------|---------|-------|
| `page_view` | Page load | page_path, page_title |
| `form_start` | Primeiro input focus | form_location (hero/cta_final) |
| `lead_capture` | Form submit sucesso | method: "mailchimp" |
| `form_error` | Form submit falha | error_message |
| `whatsapp_click` | Click botão WhatsApp | page: "confirma-cadastro-lives" |
| `scroll_depth` | 25%, 50%, 75%, 100% | percent_scrolled |

---

*Wireframe criado por Uma (@ux-design-expert) — Synkra AIOS*
