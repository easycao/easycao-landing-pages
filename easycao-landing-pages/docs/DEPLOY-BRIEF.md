# Easycao Landing Pages — Deploy & SEO Brief

**Projeto:** Easycao Landing Pages
**Stack:** Next.js 16.1.6 · React 19.2.3 · Tailwind CSS v4
**Páginas:** `/lives` (landing) · `/confirma-cadastro-lives` (obrigado)
**Data:** 2026-03-02
**Autor:** Atlas (Analyst Agent)

---

## Sumário Executivo

O frontend está pronto. Para colocar em produção com máxima performance e visibilidade no Google, existem **21 itens** distribuídos em **5 fases**. O deploy recomendado é na **Vercel** (zero-config para Next.js, HTTPS automático, CDN edge global, domínio custom).

**Nota atual do projeto:** C- (boa base, falta infraestrutura SEO)
**Nota estimada após implementação:** A-

---

## FASE 1 — Segurança (Fazer PRIMEIRO)

> Bloqueia deploy. Credenciais expostas no código fonte.

### 1.1 Mover credenciais para variáveis de ambiente

**Arquivo:** `src/app/api/subscribe/route.ts`
**Problema:** API key do Mailchimp hardcoded no código (linha 3-6)

**Ação:**
1. Criar `.env.local` na raiz do projeto `/app`:
```env
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_SERVER=us8
MAILCHIMP_AUDIENCE_ID=your_audience_id_here
MAILCHIMP_TAG=Lives
```

2. Adicionar `.env.local` ao `.gitignore` (se não estiver)

3. No `route.ts`, substituir as constantes por:
```ts
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_TAG = process.env.MAILCHIMP_TAG || "Lives";
```

4. Na Vercel, configurar as mesmas variáveis em Settings > Environment Variables

### 1.2 Regenerar a API key do Mailchimp
- A key atual já está exposta no código fonte
- Ir em Mailchimp > Account > API Keys > gerar nova key
- Atualizar em `.env.local` e na Vercel

---

## FASE 2 — SEO Técnico (Infraestrutura)

> Sem isso, o Google não encontra o site corretamente.

### 2.1 Criar `app/robots.ts`
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/confirma-cadastro-lives"],
    },
    sitemap: "https://easycao.com/sitemap.xml",
  };
}
```
> Nota: `/confirma-cadastro-lives` é bloqueada pois é página de pós-conversão, não deve aparecer no Google.

### 2.2 Criar `app/sitemap.ts`
```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://easycao.com/lives",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

### 2.3 Completar metadata no `layout.tsx`
Adicionar ao `metadata` existente:
```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://easycao.com"),
  title: "Easycao — Domine a prova ICAO. Na prática.",
  description:
    "Participe das lives semanais gratuitas com aulas ao vivo e simulados da prova ICAO. Preparação com Diogo Verzola, examinador ICAO credenciado.",
  icons: {
    icon: "/favicon.webp",
    apple: "/favicon.webp",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Easycao — Domine a prova ICAO. Na prática.",
    description:
      "Lives semanais gratuitas com aulas ao vivo e simulados da prova ICAO.",
    url: "https://easycao.com/lives",
    siteName: "Easycao",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Easycao — Domine a prova ICAO",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easycao — Domine a prova ICAO. Na prática.",
    description:
      "Lives semanais gratuitas com aulas ao vivo e simulados da prova ICAO.",
    images: ["/og-image.png"],
  },
};
```

### 2.4 Criar imagem OG
- Dimensões: **1200 x 630 px**
- Conteúdo sugerido: logo Easycao + headline + foto do Diogo + fundo azul gradiente
- Salvar como `/public/og-image.png`
- Esta é a preview que aparece ao compartilhar o link no WhatsApp, Facebook, Instagram e Twitter

### 2.5 Adicionar metadata na página de confirmação
Criar `src/app/confirma-cadastro-lives/layout.tsx`:
```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro Confirmado — Easycao",
  description: "Seu cadastro foi confirmado. Entre no grupo do WhatsApp para receber os avisos das lives.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

---

## FASE 3 — Performance & next.config.ts

> Impacta diretamente Core Web Vitals e ranking no Google.

### 3.1 Configurar `next.config.ts` completo
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|woff2|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 3.2 Otimizar imagem hero
**Problema:** `diogo.png` tem **795 KB** — é o LCP da página e vai causar nota RUIM no Google.

**Ação:**
1. Converter `diogo.png` para WebP (estimativa: ~200-250KB)
2. Alternativa: manter o PNG e confiar no next/image (já serve WebP/AVIF automaticamente)
3. O ideal é fornecer o original em alta qualidade e deixar o Next.js otimizar

> O next/image com `formats: ["image/avif", "image/webp"]` no config já resolve a entrega, mas o arquivo original grande ainda impacta o build. Recomendo converter para WebP.

### 3.3 Limpar assets não utilizados do `/public`
Remover arquivos do template Next.js que não são usados:
- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

---

## FASE 4 — Structured Data (Rich Snippets)

> Permite que o Google mostre cards especiais nos resultados de busca.

### 4.1 JSON-LD na página `/lives`
Adicionar no `page.tsx` da rota `/lives`, dentro do return, antes de `<main>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Easycao",
          "url": "https://easycao.com",
          "logo": "https://easycao.com/logo.webp",
          "description": "Preparação gratuita para a prova ICAO com lives semanais.",
        },
        {
          "@type": "Person",
          "name": "Diogo Verzola",
          "jobTitle": "Examinador ICAO Credenciado",
          "worksFor": { "@type": "Organization", "name": "Easycao" },
          "image": "https://easycao.com/prof-diogo.jpg",
          "description": "Criador do Método Easycao. Especialista em preparação para a prova ICAO.",
        },
        {
          "@type": "Event",
          "name": "Aula ao Vivo — Prova ICAO",
          "description": "Live semanal no Instagram sobre a prova ICAO com Prof. Diogo Verzola.",
          "startDate": "2026-03-03T19:00:00-03:00",
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "location": {
            "@type": "VirtualLocation",
            "url": "https://instagram.com/easycao",
          },
          "organizer": { "@type": "Organization", "name": "Easycao" },
          "performer": { "@type": "Person", "name": "Diogo Verzola" },
          "isAccessibleForFree": true,
          "eventSchedule": {
            "@type": "Schedule",
            "repeatFrequency": "P1W",
            "byDay": "https://schema.org/Tuesday",
            "startTime": "19:00:00-03:00",
          },
        },
        {
          "@type": "Event",
          "name": "Simulado ICAO ao Vivo",
          "description": "Simulado ICAO semanal no YouTube com correção ao vivo.",
          "startDate": "2026-03-05T13:30:00-03:00",
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "location": {
            "@type": "VirtualLocation",
            "url": "https://youtube.com/@easycao",
          },
          "organizer": { "@type": "Organization", "name": "Easycao" },
          "performer": { "@type": "Person", "name": "Diogo Verzola" },
          "isAccessibleForFree": true,
          "eventSchedule": {
            "@type": "Schedule",
            "repeatFrequency": "P1W",
            "byDay": "https://schema.org/Thursday",
            "startTime": "13:30:00-03:00",
          },
        },
      ],
    }),
  }}
/>
```

### 4.2 Validar Structured Data
Após deploy, testar em:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

---

## FASE 5 — Deploy na Vercel

### 5.1 Pré-requisitos
- [ ] Conta na Vercel (https://vercel.com — free tier suporta o projeto inteiro)
- [ ] Domínio `easycao.com` (ou o domínio escolhido)
- [ ] Repositório Git (GitHub/GitLab/Bitbucket)

### 5.2 Passos de deploy

**1. Push do código para GitHub**
```bash
cd C:/Users/pcleo/workspace/easycao-landing-pages
git add .
git commit -m "feat: initial production-ready landing page"
git remote add origin https://github.com/SEU_USUARIO/easycao-landing-pages.git
git push -u origin master
```

**2. Conectar na Vercel**
1. Ir em https://vercel.com/new
2. Importar o repositório do GitHub
3. **Root Directory:** `app` (importante — o Next.js está dentro de `/app`)
4. Framework Preset: Next.js (auto-detectado)
5. Build Command: `next build` (default)
6. Output Directory: `.next` (default)

**3. Configurar variáveis de ambiente na Vercel**
Em Settings > Environment Variables, adicionar:
```
MAILCHIMP_API_KEY = (nova key regenerada)
MAILCHIMP_SERVER = us8
MAILCHIMP_AUDIENCE_ID = your_audience_id_here
MAILCHIMP_TAG = Lives
```

**4. Configurar domínio custom**
1. Em Settings > Domains, adicionar `easycao.com`
2. Configurar DNS no provedor do domínio:
   - **Tipo A:** `76.76.21.21` (Vercel)
   - **Tipo CNAME:** `www` → `cname.vercel-dns.com`
3. A Vercel gera certificado SSL automaticamente (HTTPS)
4. Redirect de `www` para `easycao.com` (ou vice-versa) é automático

**5. Configurar redirect da raiz para /lives**
No `next.config.ts`, adicionar dentro do objeto:
```ts
async redirects() {
  return [
    {
      source: "/",
      destination: "/lives",
      permanent: true,
    },
  ];
},
```

**6. Primeiro deploy**
- A Vercel faz deploy automático no push para `master`/`main`
- Preview deploys automáticos para branches de feature
- Verificar no dashboard da Vercel se o build passou

### 5.3 Pós-deploy

**1. Google Search Console**
1. Ir em https://search.google.com/search-console
2. Adicionar propriedade: `easycao.com`
3. Verificar via DNS (adicionar TXT record) ou via arquivo HTML
4. Submeter sitemap: `https://easycao.com/sitemap.xml`
5. Solicitar indexação da página `/lives`

**2. Testar tudo**
- [ ] Lighthouse: rodar em https://pagespeed.web.dev — meta: score >= 90 nas 4 categorias
- [ ] Rich Results: testar em https://search.google.com/test/rich-results
- [ ] Social Preview: testar em https://developers.facebook.com/tools/debug/
- [ ] Mobile: acessar pelo celular e verificar layout completo
- [ ] Formulário: testar cadastro real e verificar no Mailchimp
- [ ] WhatsApp: testar link do grupo na página de confirmação
- [ ] GTM: verificar no Tag Assistant que os eventos estão disparando

**3. Monitoramento contínuo**
- Google Search Console: verificar indexação semanal
- Vercel Analytics (free tier): Web Vitals reais
- Mailchimp: monitorar taxa de cadastros

---

## FASE OPCIONAL — Melhorias Futuras

### Acessibilidade
- [ ] Adicionar `<label>` nos inputs do formulário (em vez de só placeholder)
- [ ] Adicionar `prefers-reduced-motion` no globals.css para desabilitar animações
- [ ] Adicionar `:focus-visible` styles para navegação por teclado
- [ ] Adicionar `aria-label` nos ícones SVG

### Performance Extra
- [ ] Migrar GTM para `@next/third-parties/google` (pacote oficial Next.js)
- [ ] Adicionar `useReportWebVitals` para enviar métricas ao GA4
- [ ] Criar `not-found.tsx` (página 404 customizada)
- [ ] Criar `site.webmanifest` (PWA — app instalável no celular)

### Conteúdo
- [ ] Substituir imagens placeholder do carrossel de aprovações (`/aprovacoes/`) por imagens reais
- [ ] Adicionar mais imagens de aprovação variadas

---

## Checklist Final de Deploy

### Antes de subir o código
- [ ] Credenciais movidas para `.env.local`
- [ ] `.env.local` no `.gitignore`
- [ ] API key do Mailchimp regenerada
- [ ] `robots.ts` criado
- [ ] `sitemap.ts` criado
- [ ] Metadata completo (OG image, Twitter card, canonical)
- [ ] Imagem OG criada (1200x630)
- [ ] Metadata na página de confirmação
- [ ] `next.config.ts` configurado (headers, images, redirect)
- [ ] Assets não utilizados removidos do `/public`
- [ ] JSON-LD structured data adicionado
- [ ] `diogo.png` otimizado ou convertido para WebP
- [ ] Build local sem erros: `npm run build`
- [ ] Lint sem erros: `npm run lint`

### Após o deploy
- [ ] Site acessível via HTTPS no domínio custom
- [ ] Formulário funcionando (testar cadastro)
- [ ] Eventos GTM disparando (usar Tag Assistant)
- [ ] Lighthouse score >= 90
- [ ] Rich Results validados
- [ ] Social preview funcionando (WhatsApp, Facebook)
- [ ] Google Search Console verificado + sitemap submetido
- [ ] Redirect raiz → /lives funcionando

---

*Documento gerado por Atlas (Analyst Agent) — Easycao Landing Pages Deploy Brief v1.0*
