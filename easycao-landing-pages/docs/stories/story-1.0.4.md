# Story 1.0.4 — JSON-LD Structured Data

**Status:** Done
**Priority:** High
**Brief Reference:** FASE 4 — Structured Data (Rich Snippets)

---

## Story

As a site owner, I need JSON-LD structured data on the landing page so that Google can display rich snippets (Organization, Person, recurring Events) in search results, increasing click-through rates.

## Acceptance Criteria

- [ ] AC1: `/lives/page.tsx` includes a `<script type="application/ld+json">` tag with a `@graph` array
- [ ] AC2: Graph includes an `Organization` schema for Easycao with logo and social links
- [ ] AC3: Graph includes a `Person` schema for Diogo Verzola with jobTitle and image
- [ ] AC4: Graph includes an `Event` schema for Tuesday Instagram Live (19h, weekly)
- [ ] AC5: Graph includes an `Event` schema for Thursday YouTube Live (13h30, weekly)
- [ ] AC6: Both Events include `eventSchedule` with `repeatFrequency: P1W` for recurring events
- [ ] AC7: Both Events include `isAccessibleForFree: true`
- [ ] AC8: Build succeeds with `npm run build`

## Tasks

- [x] Task 1: Add JSON-LD `<script>` block to `src/app/lives/page.tsx` before `<main>`, wrapped in a fragment
- [x] Task 2: Include Organization schema (name, url, logo, sameAs with Instagram + YouTube)
- [x] Task 3: Include Person schema (Diogo Verzola, jobTitle, image, worksFor)
- [x] Task 4: Include Event schema for Tuesday Instagram Live (weekly, 19h BRT)
- [x] Task 5: Include Event schema for Thursday YouTube Live (weekly, 13h30 BRT)
- [x] Task 6: Verify build succeeds

## Dev Notes

**Domain:** `https://easycao.com`
**Instagram:** `https://instagram.com/easycao.official`
**YouTube:** `https://www.youtube.com/@easycaofficial`

### JSON-LD block
Add before `<main>` inside a `<>...</>` fragment:

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
          "sameAs": [
            "https://instagram.com/easycao.official",
            "https://www.youtube.com/@easycaofficial"
          ]
        },
        {
          "@type": "Person",
          "name": "Diogo Verzola",
          "jobTitle": "Examinador ICAO Credenciado",
          "worksFor": { "@type": "Organization", "name": "Easycao" },
          "image": "https://easycao.com/prof-diogo.webp",
          "description": "Criador do Método Easycao. Especialista em preparação para a prova ICAO."
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
            "url": "https://instagram.com/easycao.official"
          },
          "organizer": { "@type": "Organization", "name": "Easycao" },
          "performer": { "@type": "Person", "name": "Diogo Verzola" },
          "isAccessibleForFree": true,
          "eventSchedule": {
            "@type": "Schedule",
            "repeatFrequency": "P1W",
            "byDay": "https://schema.org/Tuesday",
            "startTime": "19:00:00-03:00"
          }
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
            "url": "https://www.youtube.com/@easycaofficial"
          },
          "organizer": { "@type": "Organization", "name": "Easycao" },
          "performer": { "@type": "Person", "name": "Diogo Verzola" },
          "isAccessibleForFree": true,
          "eventSchedule": {
            "@type": "Schedule",
            "repeatFrequency": "P1W",
            "byDay": "https://schema.org/Thursday",
            "startTime": "13:30:00-03:00"
          }
        }
      ]
    }),
  }}
/>
```

**IMPORTANT:** The page currently returns `<main>` directly. Wrap in a fragment `<>...</>` to include the script tag before `<main>`.

## File List

- `src/app/lives/page.tsx` — Modified (JSON-LD script added)

---

## Dev Agent Record

### Debug Log
(none)

### Completion Notes
(pending)

### Change Log
(pending)
