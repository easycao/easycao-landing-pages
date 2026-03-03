# Easycao — Style Guide

Extracted from the Lives Landing Page (`easycao.com/lives`) and Thank You page (`/confirma-cadastro-lives`).

---

## 1. Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1F96F7` | Primary brand blue — buttons, links, accents, icons |
| `primary-dark` | `#0057B4` | Dark blue — gradients, footer, stat numbers |
| `primary-light` | `#34B8F8` | Light blue — hover states, time highlights, glass accents |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `white` | `#FFFFFF` | Cards, form backgrounds |
| `black` | `#353535` | Body text (NOT pure black — warm charcoal) |
| `gray-light` | `#F8FAFC` | Section backgrounds, input backgrounds, countdown blocks |
| `gray-border` | `#E5E7EB` | Card borders, dividers, input borders |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `whatsapp` | `#25D366` | WhatsApp CTA button |
| `whatsapp-hover` | `#1DA851` | WhatsApp button hover |
| Red 500 | `#EF4444` | Live indicator dot, error text |
| Green 400 | `#4ADE80` | Online/active indicator dot |

### Gradients
| Name | Value | Usage |
|------|-------|-------|
| Hero gradient | `from-[#0a3d6b] via-primary-dark to-primary` | Hero section background |
| CTA gradient | `from-primary to-primary-dark` | CTA sections, confirmation page |
| Hub center | `from-primary to-primary-dark` | Hub circle icon |

### Opacity Patterns
| Pattern | Usage |
|---------|-------|
| `text-white/80` | Secondary text on dark backgrounds |
| `text-white/70` | Tertiary text on dark backgrounds |
| `text-white/60` | Muted text on dark backgrounds |
| `text-white/50` | Very muted text on dark backgrounds |
| `text-black/70` | Secondary body text on white |
| `text-black/60` | Card description text |
| `text-black/50` | Muted labels, footer text |
| `bg-white/10` | Glass pill badge on hero |
| `bg-white/5` | Decorative circles |
| `bg-primary/10` | Icon background tint |
| `bg-primary/20` | Icon hover background tint |

---

## 2. Typography

### Font
- **Family:** Poppins (Google Fonts)
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **CSS Variable:** `--font-poppins`
- **Fallback:** System sans-serif via `font-sans`

### Type Scale

| Level | Mobile | Desktop | Weight | Usage |
|-------|--------|---------|--------|-------|
| H1 | `text-2xl` (24px) / `sm:text-3xl` | `lg:text-[44px]` | Bold (700) | Page hero headline |
| H2 | `text-2xl` (24px) | `lg:text-4xl` (36px) | Bold (700) | Section headings |
| H3 (card) | `text-base` (16px) | `text-base` (16px) | Bold (700) | Card titles |
| H3 (live) | `text-xl` (20px) | `lg:text-2xl` (24px) | Bold (700) | Live card titles |
| Body Large | `text-base` (16px) | `lg:text-xl` (20px) | Regular (400) | Hero subtitle |
| Body | `text-base` (16px) | `lg:text-lg` (18px) | Regular (400) | Paragraph text |
| Body Small | `text-sm` (14px) | `text-sm` (14px) | Regular/Medium | Card descriptions |
| Caption | `text-xs` (12px) | `text-xs` (12px) | Medium (500) | Badges, fine print |
| Overline | `text-sm` (14px) | `text-sm` (14px) | Medium (500) | Section labels (uppercase, tracking-widest) |
| Stat Number | `text-3xl` (30px) | `lg:text-5xl` (48px) | Bold (700) | Countdown numbers |
| Stat Label | `text-[10px]` | `lg:text-xs` | Medium (500) | Countdown units (uppercase) |

### Text Colors by Context
| Context | Color |
|---------|-------|
| Headings on white | `text-black` (#353535) |
| Body on white | `text-black/70` |
| Descriptions on white | `text-black/60` |
| Labels on white | `text-black/50` |
| Headings on dark | `text-white` |
| Body on dark | `text-white/80` |
| Descriptions on dark | `text-white/70` |
| Accent text | `text-primary` |
| Stat numbers | `text-primary-dark` |
| Error text | `text-red-500` |

---

## 3. Spacing & Layout

### Container Widths
| Container | Width | Usage |
|-----------|-------|-------|
| Main | `max-w-7xl` (1280px) | Header, hero, footer |
| Content | `max-w-6xl` (1152px) | Hub & spoke, professor section |
| Lives | `max-w-5xl` (1024px) | Lives cards + countdown |
| CTA | `max-w-xl` (576px) | CTA form section |
| Form (CTA) | `max-w-lg` (512px) | Form card in CTA variant |

### Horizontal Padding
- Standard: `px-5 lg:px-8`
- Header: `px-4 lg:px-8`

### Section Vertical Spacing
- Standard: `py-16 lg:py-20`
- Extended: `py-16 lg:py-24`

### Card Padding
- Standard: `p-6 lg:p-8`
- Large (forms): `p-8 lg:p-10`
- Confirmation: `p-10 lg:p-14`

### Gap Patterns
- Grid gap: `gap-10 lg:gap-16` (hero columns)
- Card gap: `gap-4 lg:gap-6` (lives cards)
- Form fields: `space-y-4`
- Stat badges: `gap-3` (mobile), `gap-3 lg:gap-4` (countdown)

---

## 4. Border Radius

| Element | Radius | Value |
|---------|--------|-------|
| Cards | `rounded-2xl` | 16px |
| Thank you card | `rounded-3xl` | 24px |
| Buttons | `rounded-xl` | 12px |
| Inputs | `rounded-xl` | 12px |
| Tags/Badges | `rounded-full` | 9999px |
| Icon containers | `rounded-xl` | 12px |
| Credential badge | `rounded-lg` | 8px |
| Images (professor) | `rounded-2xl` | 16px |
| Carousel images | `rounded-xl` | 12px |

---

## 5. Shadows

| Level | Class | Usage |
|-------|-------|-------|
| Subtle | `shadow-sm` | Default card state |
| Medium | `shadow-md` | Carousel images |
| Large | `shadow-lg` | Buttons, hover badges |
| XL | `shadow-xl` | Photo container, card hover state |
| 2XL | `shadow-2xl` | Forms, countdown, featured cards |

---

## 6. Components

### 6.1 Navbar (Global — all pages except Lives)
- Position: `sticky top-0 z-50`
- Background: `bg-white/95 backdrop-blur-md`
- Border: `border-b border-gray-border`
- Height: `h-14 lg:h-16`
- Content: Logo + brand name (left), nav links (center), CTA button "Matricular" or "WhatsApp" (right)
- CTA button: `bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-6 py-2.5`
- Mobile: hamburger menu or simplified layout

### 6.1b Header Countdown (Lives page only)
- Same sticky/blur pattern as Navbar
- Content: Logo + brand name (left), countdown timer (right/center)
- This is a page-specific variant used only on `/lives`

### 6.2 Hero Section
- Background: gradient `from-[#0a3d6b] via-primary-dark to-primary`
- Height: `min-h-[90vh]`
- Layout: 2-column grid (text+form left, photo+cards right)
- Decorative: 3 large translucent circles as bg orbs
- Contains: pill badge, H1, subtitle, LeadForm

### 6.3 Lead Form (White Card)
- Container: `bg-white rounded-2xl shadow-2xl p-8 lg:p-10`
- Title: centered semibold text
- Inputs: icon (left, gray-400) + input field
- Input style: `pl-12 pr-4 py-4 rounded-xl border border-gray-border bg-gray-light`
- Focus: `focus:ring-2 focus:ring-primary focus:border-transparent`
- Button: full-width, `bg-primary-light hover:bg-primary`, uppercase, bold
- Loading state: spinner + "Cadastrando..."
- Error shake animation on validation failure
- Privacy note: `text-xs text-gray-400` with lock emoji

### 6.4 Countdown Timer (White Card)
- Container: `bg-white rounded-2xl shadow-2xl p-8 lg:p-10 mt-12`
- Live label: red dot emoji + primary text
- Blocks: `bg-gray-light rounded-xl` with stat number + unit label
- Block size: `min-w-[70px] lg:min-w-[90px]`

### 6.5 Hub & Spoke Section
- Background: `bg-white`
- Overline label: primary color, uppercase, tracking-widest
- Desktop: 2x2 grid with center hub (logo in gradient circle)
- Cards: white, `border border-gray-border`, accent line on hover
- Hover effects: border-primary/30, shadow-xl, stat badge appears
- Mobile: stacked cards with centered hub icon

### 6.6 Glass Cards (Glassmorphism)
- Background: `rgba(255,255,255,0.07)` to `rgba(255,255,255,0.10)`
- Backdrop: `backdrop-filter: blur(16px)`
- Border: `1px solid rgba(255,255,255,0.10)` to `rgba(255,255,255,0.15)`
- Used in: ICAO dashboard cards, credential box, live schedule cards, confirmation floating cards

### 6.7 Lives Cards
- Container: glass card on dark gradient
- Hover: `bg-white/20 scale-[1.02]`
- Content: icon + tag (top), title, day, time (primary-light bold), description
- Tag: `bg-white/10 px-3 py-1 rounded-full`

### 6.8 Professor Section
- Layout: 5-column grid (2 photo, 3 text)
- Photo: `rounded-2xl shadow-xl overflow-hidden`
- Overline: primary uppercase tracking-widest
- Credential badges: `bg-sky-50 border border-primary/20 rounded-lg px-5 py-3`

### 6.9 Approval Carousel
- Background: `bg-gray-light`
- Animation: CSS marquee, infinite loop, pauses on hover/touch
- Images: `rounded-xl shadow-md`, hover: `scale-105 shadow-xl`
- Duration: 40s per loop

### 6.10 CTA Section
- Background: gradient `from-primary to-primary-dark`
- Centered heading + subtitle + LeadForm (cta variant)
- Scroll-reveal animation

### 6.11 Footer
- Background: `bg-primary-dark`
- Content: logo + brand name (left), copyright (right)
- Logo: `brightness-200` filter for white appearance
- Text: `text-white/70` name, `text-white/50` copyright

### 6.12 Confirmation Page
- Full screen gradient background
- Centered white card (`rounded-3xl shadow-2xl`)
- Animated check mark (SVG circle-draw + check-draw)
- WhatsApp CTA button (green, pulse animation)
- Schedule info with divider
- Floating glass cards (Instagram + YouTube schedule) behind main card

---

## 7. Animations

### Keyframe Animations
| Name | Duration | Usage |
|------|----------|-------|
| `fade-in-up` | 0.6s ease-out | Entry animations |
| `fade-in-left` | 0.7s ease-out | Slide from left |
| `fade-in-right` | 0.7s ease-out | Slide from right |
| `marquee` | 30-40s linear infinite | Carousel scroll |
| `marquee-reverse` | 30-40s linear infinite | Reverse carousel |
| `pulse-subtle` | 2s ease-in-out infinite | WhatsApp CTA |
| `shake` | 0.4s ease-in-out | Form error feedback |
| `confetti-fall` | 3s ease-in | Celebration effect |
| `circle-draw` | 0.8s ease-out | Check circle SVG |
| `check-draw` | 0.5s ease-out (0.5s delay) | Checkmark SVG |

### Scroll Reveal (IntersectionObserver)
- Hook: `useInView(threshold)`
- Default threshold: `0.1` (10% visible triggers)
- Pattern: elements start `opacity-0 translate-y-5` and transition to `opacity-100 translate-y-0`
- Staggered delays: `transitionDelay: ${i * 100-150}ms`
- Once only: observer disconnects after first intersection

### Hover Transitions
- Standard: `transition-all duration-300`
- Cards: `hover:scale-[1.02] hover:shadow-xl`
- Buttons: `hover:scale-[1.02]` to `hover:scale-[1.03]`
- CTA button disabled: `disabled:hover:scale-100`

---

## 8. Responsive Breakpoints

Uses Tailwind default breakpoints:
| Prefix | Min-width | Usage |
|--------|-----------|-------|
| (none) | 0px | Mobile first |
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |

### Key Responsive Patterns
- Hero: single column mobile → 2-column desktop
- Hub & Spoke: stacked mobile → 2x2 grid with center hub desktop
- Professor: stacked mobile → 5-column grid desktop
- Lives: single column mobile → 2-column desktop
- Header: countdown centered mobile → logo left + countdown right desktop
- ICAO Dashboard: compact cards mobile → floating positioned cards desktop

---

## 9. Iconography

- **Style:** Feather/Lucide-style SVG icons (stroke-based)
- **Stroke width:** 1.5 (cards) to 2 (credentials, form)
- **Sizes:** 14px (mobile mini), 18px (form inputs), 20px (badges), 22px (dashboard), 36-40px (live cards)
- **Color:** Inherits from parent (`currentColor`) or explicit hex
- **Icons used:** User, Mail, Phone, Airplane, Instagram, YouTube, Warning, Image, Layers, MessageSquare, CheckCircle, WhatsApp

---

## 10. Interactive States

### Buttons
| State | Style |
|-------|-------|
| Default | `bg-primary-light text-white font-bold uppercase` |
| Hover | `bg-primary scale-[1.02]` |
| Disabled | `opacity-50 cursor-not-allowed hover:scale-100` |
| Loading | Spinner SVG + "Cadastrando..." |
| WhatsApp | `bg-whatsapp hover:bg-whatsapp-hover scale-[1.03]` |

### Inputs
| State | Style |
|-------|-------|
| Default | `border-gray-border bg-gray-light` |
| Focus | `ring-2 ring-primary border-transparent` |
| Placeholder | `text-gray-400` |

### Cards
| State | Style |
|-------|-------|
| Default | `border-gray-border shadow-sm` |
| Hover | `border-primary/30 shadow-xl` + accent line appears |

---

## 11. Technical Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 with `@theme inline` tokens
- **Font loading:** `next/font/google` with `display: swap`
- **Image optimization:** `next/image` with AVIF/WebP formats
- **Analytics:** GTM via manual `afterInteractive` script
- **Animations:** CSS keyframes + IntersectionObserver for scroll
- **Form:** Client component with server-side API route (`/api/subscribe`)

---

## 12. File Structure

```
app/src/
├── app/
│   ├── globals.css              # Design tokens + animations
│   ├── layout.tsx               # Root layout (Poppins + GTM)
│   ├── page.tsx                 # Redirect to /lives
│   ├── lives/
│   │   ├── page.tsx             # Main landing page
│   │   ├── HeaderCountdown.tsx  # Sticky header with timer
│   │   ├── HubAndSpoke.tsx      # "What you'll learn" section
│   │   ├── ICAODashboard.tsx    # Floating exam parts cards
│   │   ├── LivesCards.tsx       # Live schedule cards
│   │   ├── ProfessorSection.tsx # Instructor bio section
│   │   └── CTASection.tsx       # Bottom CTA with form
│   ├── confirma-cadastro-lives/
│   │   ├── layout.tsx           # noindex metadata
│   │   └── page.tsx             # Thank you / WhatsApp CTA
│   └── api/subscribe/
│       └── route.ts             # Mailchimp API integration
├── components/
│   ├── LeadForm.tsx             # Reusable form component
│   ├── CountdownTimer.tsx       # Countdown block component
│   ├── ApprovalCarousel.tsx     # Marquee image carousel
│   └── useInView.ts            # IntersectionObserver hook
└── public/
    ├── logo.webp
    ├── favicon.webp
    ├── diogo.webp
    ├── prof-diogo.webp
    ├── og-image.png
    └── aprovacoes/              # Approval screenshot images
```
