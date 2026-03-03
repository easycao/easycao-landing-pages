"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HOTMART_CHECKOUT_URL } from "../lib/constants";
import { getPagesByCategory } from "../lib/content-pages";

const corePages = getPagesByCategory("core");

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-border">
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-14 lg:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.webp" alt="Easycao" width={32} height={32} />
          <span className="font-bold text-black text-lg">Easycao</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Prova ICAO dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={`font-medium transition-colors ${dropdownOpen ? "text-primary" : "text-black/70 hover:text-primary"}`}>
              Prova ICAO
              <svg className="inline ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-border py-2 z-50">
                {corePages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isActive(`/${page.slug}`)
                        ? "text-primary bg-primary/5 font-medium"
                        : "text-black/70 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {page.title.replace(/:.*/,"")}
                  </Link>
                ))}
                <div className="border-t border-gray-border mt-1 pt-1">
                  <Link
                    href="/conteudos"
                    className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                  >
                    Ver todos os conteudos &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/metodo"
            className={`font-medium transition-colors ${
              isActive("/metodo") ? "text-primary" : "text-black/70 hover:text-primary"
            }`}
          >
            Metodo
          </Link>

          <Link
            href="/lives"
            className={`font-medium transition-colors ${
              isActive("/lives") ? "text-primary" : "text-black/70 hover:text-primary"
            }`}
          >
            Lives
          </Link>
        </div>

        {/* Desktop CTA */}
        <a
          href={HOTMART_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-block bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-6 py-2.5 transition-all hover:scale-[1.02]"
        >
          Matricular
        </a>

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
          <div className="py-3">
            <p className="text-xs font-medium text-black/50 uppercase tracking-widest mb-2">Prova ICAO</p>
            {corePages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm text-black/70 hover:text-primary"
              >
                {page.title.replace(/:.*/,"")}
              </Link>
            ))}
            <Link
              href="/conteudos"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-primary"
            >
              Ver todos os conteudos &rarr;
            </Link>
          </div>
          <div className="border-t border-gray-border pt-3 space-y-2">
            <Link
              href="/metodo"
              onClick={() => setMenuOpen(false)}
              className="block py-2 font-medium text-black/70 hover:text-primary"
            >
              Metodo
            </Link>
            <Link
              href="/lives"
              onClick={() => setMenuOpen(false)}
              className="block py-2 font-medium text-black/70 hover:text-primary"
            >
              Lives
            </Link>
          </div>
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 text-center bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-6 py-3 transition-all"
          >
            Matricular
          </a>
        </div>
      )}
    </header>
  );
}
