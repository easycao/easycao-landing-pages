import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import CountdownTimer from "@/components/CountdownTimer";
import HeaderCountdown from "./HeaderCountdown";
import ApprovalCarousel from "@/components/ApprovalCarousel";
import HubAndSpoke from "./HubAndSpoke";
import ICAODashboard from "./ICAODashboard";
import LivesCards from "./LivesCards";
import ProfessorSection from "../../components/ProfessorSection";
import CTASection from "./CTASection";

export default function LivesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Easycao",
                url: "https://easycao.com",
                logo: "https://easycao.com/logo.webp",
                description:
                  "Preparação gratuita para a prova ICAO com lives semanais.",
                sameAs: [
                  "https://instagram.com/easycao.official",
                  "https://www.youtube.com/@easycaofficial",
                ],
              },
              {
                "@type": "Person",
                name: "Diogo Verzola",
                jobTitle: "Examinador ICAO Credenciado",
                worksFor: { "@type": "Organization", name: "Easycao" },
                image: "https://easycao.com/prof-diogo.webp",
                description:
                  "Criador do Método Easycao. Especialista em preparação para a prova ICAO.",
              },
              {
                "@type": "Event",
                name: "Aula ao Vivo — Prova ICAO",
                description:
                  "Live semanal no Instagram sobre a prova ICAO com Prof. Diogo Verzola.",
                startDate: "2026-03-03T19:00:00-03:00",
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode:
                  "https://schema.org/OnlineEventAttendanceMode",
                location: {
                  "@type": "VirtualLocation",
                  url: "https://instagram.com/easycao.official",
                },
                organizer: { "@type": "Organization", name: "Easycao" },
                performer: { "@type": "Person", name: "Diogo Verzola" },
                isAccessibleForFree: true,
                eventSchedule: {
                  "@type": "Schedule",
                  repeatFrequency: "P1W",
                  byDay: "https://schema.org/Tuesday",
                  startTime: "19:00:00-03:00",
                },
              },
              {
                "@type": "Event",
                name: "Simulado ICAO ao Vivo",
                description:
                  "Simulado ICAO semanal no YouTube com correção ao vivo.",
                startDate: "2026-03-05T13:30:00-03:00",
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode:
                  "https://schema.org/OnlineEventAttendanceMode",
                location: {
                  "@type": "VirtualLocation",
                  url: "https://www.youtube.com/@easycaofficial",
                },
                organizer: { "@type": "Organization", name: "Easycao" },
                performer: { "@type": "Person", name: "Diogo Verzola" },
                isAccessibleForFree: true,
                eventSchedule: {
                  "@type": "Schedule",
                  repeatFrequency: "P1W",
                  byDay: "https://schema.org/Thursday",
                  startTime: "13:30:00-03:00",
                },
              },
            ],
          }),
        }}
      />
    <main>
      {/* Header with Countdown */}
      <HeaderCountdown />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-[10%] w-[300px] h-[300px] bg-primary-light/10 rounded-full blur-3xl" />

        {/* Diogo photo + floating cards + glass box - desktop */}
        <div className="hidden lg:block absolute bottom-0 right-0 z-[5] pointer-events-none">
          {/* Floating cards — behind Diogo, z-[1] */}
          <ICAODashboard />

          {/* Diogo photo — defines container size (not absolute), z-[2] */}
          <Image
            src="/diogo.webp"
            alt="Prof. Diogo Verzola"
            width={2000}
            height={2400}
            className="relative z-[2] block drop-shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
            style={{ height: "715px", width: "auto" }}
            priority
          />

          {/* Glass credential box — on top of photo, z-[3] */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-[3] pointer-events-auto animate-fade-in-up"
            style={{
              bottom: "40px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "14px 24px",
              minWidth: "340px",
              animationDelay: "0.3s",
              animationFillMode: "backwards",
            }}
          >
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-white font-semibold text-sm">Prof. Diogo Verzola</p>
                <p className="text-white/60 text-xs">Examinador ICAO Credenciado</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Métrica ICAO</p>
                <p className="text-white font-bold text-sm">Níveis 4 a 6</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12 pb-0 lg:py-20 w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left column - Copy + Form */}
            <div className="order-1 relative z-10 lg:col-span-1">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/90 text-xs font-medium">
                    +1000 pilotos aprovados
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-tight lg:leading-[1.15]">
                  Seja aprovado no exame ICAO e garanta as melhores oportunidades
                </h1>

                <p className="text-white/80 text-base lg:text-xl mt-5 max-w-lg mx-auto lg:mx-0">
                  Aulas ao vivo, <span className="text-white font-semibold">gratuitas</span> toda terça e quinta-feira.
                </p>

              </div>

              {/* Form */}
              <div className="mt-8">
                <LeadForm variant="hero" />
              </div>
            </div>

            {/* Right column - mobile only (desktop cards are in the photo container) */}
            <div className="order-2 lg:hidden">
              <ICAODashboard />
            </div>
          </div>
        </div>
      </section>

      {/* Hub and Spoke */}
      <HubAndSpoke />

      {/* Lives + Countdown */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <h2 className="text-2xl lg:text-4xl font-bold text-white text-center mb-12">
            Lives semanais gratuitas
          </h2>

          <LivesCards />
          <CountdownTimer />
        </div>
      </section>

      {/* Professor Diogo */}
      <ProfessorSection />

      {/* Approval Carousel */}
      <ApprovalCarousel />

      {/* CTA Final */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-primary-dark py-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="Easycao"
              width={28}
              height={28}
              className="w-7 h-7 brightness-200"
            />
            <span className="text-white/70 font-medium text-sm">Easycao</span>
          </div>
          <p className="text-white/50 text-xs">
            Easycao © 2026. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
    </>
  );
}
