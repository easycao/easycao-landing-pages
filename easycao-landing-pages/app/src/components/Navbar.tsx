"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { getPageBySlug } from "../lib/content-pages";

const NAV_SLUGS = [
  "como-funciona-a-prova-icao",
  "descritores-da-prova-icao",
  "niveis-icao",
  "dicas-prova-icao-descricao-imagens",
  "como-se-preparar-para-a-prova-icao",
  "quanto-custa-a-prova-icao",
] as const;

const corePages = NAV_SLUGS.map((s) => getPageBySlug(s)!).filter(Boolean);

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) => pathname === href;

  const handleDropdownEnter = useCallback(() => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setDropdownOpen(true);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-border">
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center h-14 lg:h-16">
        {/* Logo — left */}
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Image src="/logo.webp" alt="Easycao" width={32} height={32} />
          <span className="font-bold text-primary text-lg tracking-tight">Easycao</span>
        </Link>

        {/* Desktop nav + CTA — right */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Nav links in pill container */}
          <div className="flex items-center gap-1 bg-gray-light rounded-full p-1.5 border border-gray-border/60">
            {/* Prova ICAO dropdown */}
            <div
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`px-5 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 ${
                  dropdownOpen
                    ? "text-primary bg-white shadow-sm"
                    : "text-black/70 hover:text-primary hover:bg-white/80"
                }`}
              >
                Prova ICAO
                <svg
                  className={`inline ml-1.5 w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown — with invisible bridge to prevent hover gap */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-80 bg-white rounded-2xl shadow-2xl shadow-black/8 border border-gray-border/80 py-2 overflow-hidden">
                    {corePages.map((page) => (
                      <Link
                        key={page.slug}
                        href={`/${page.slug}`}
                        className={`group/item flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 ${
                          isActive(`/${page.slug}`)
                            ? "text-primary bg-primary/8 font-semibold"
                            : "text-black/65 hover:text-primary hover:bg-primary/5 hover:pl-5"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-all duration-200 ${
                          isActive(`/${page.slug}`)
                            ? "bg-primary shadow-[0_0_8px_rgba(31,150,247,0.6)]"
                            : "bg-black/15 group-hover/item:bg-primary group-hover/item:shadow-[0_0_8px_rgba(31,150,247,0.6)]"
                        }`} />
                        {page.title.replace(/:.*/,"").trim()}
                      </Link>
                    ))}
                    <div className="border-t border-gray-border/60 mt-2 pt-2 mx-2">
                      <Link
                        href="/conteudos"
                        className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-all duration-150"
                      >
                        Ver todos os conteúdos
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/metodo"
              className={`px-5 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 ${
                isActive("/metodo")
                  ? "text-primary bg-white shadow-sm"
                  : "text-black/70 hover:text-primary hover:bg-white/80"
              }`}
            >
              Método
            </Link>

            <Link
              href="/lives"
              className={`px-5 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 ${
                isActive("/lives")
                  ? "text-primary bg-white shadow-sm"
                  : "text-black/70 hover:text-primary hover:bg-white/80"
              }`}
            >
              Lives
            </Link>
          </div>

          {/* CTA button — hidden on /metodo, links to /metodo on other pages */}
          {pathname !== "/metodo" && (
            <Link
              href="/metodo"
              className="group/cta relative overflow-hidden bg-primary hover:bg-[#1888e0] text-white font-bold text-[15px] rounded-full px-7 py-2.5 shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300 ease-out"
            >
              <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
              <span className="relative">Matricular</span>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? (
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-border bg-white px-4 pb-4">
          <div className="py-3 space-y-1">
            <Link
              href="/metodo"
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 font-semibold text-sm text-black/65 hover:text-primary transition-colors"
            >
              Método
            </Link>
            <Link
              href="/lives"
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 font-semibold text-sm text-black/65 hover:text-primary transition-colors"
            >
              Lives
            </Link>
          </div>
          <div className="border-t border-gray-border pt-3">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-2">Prova ICAO</p>
            {corePages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 py-2.5 text-sm text-black/65 hover:text-primary transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-black/20 shrink-0" />
                {page.title.replace(/:.*/,"").trim()}
              </Link>
            ))}
            <Link
              href="/conteudos"
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-semibold text-primary"
            >
              Ver todos os conteúdos &rarr;
            </Link>
          </div>
          {pathname !== "/metodo" && (
            <Link
              href="/metodo"
              onClick={() => setMenuOpen(false)}
              className="block mt-4 text-center bg-primary hover:bg-primary-dark text-white font-bold rounded-full px-6 py-3 shadow-md shadow-primary/25 transition-all duration-200"
            >
              Matricular
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
