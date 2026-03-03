import Image from "next/image";
import Link from "next/link";
import {
  HOTMART_CHECKOUT_URL,
  INSTAGRAM_URL,
  YOUTUBE_URL,
  WHATSAPP_SUPPORT_URL,
} from "../lib/constants";
import { getPagesByCategory } from "../lib/content-pages";

const corePages = getPagesByCategory("core");

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Easycao */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.webp"
                alt="Easycao"
                width={32}
                height={32}
                className="brightness-200"
              />
              <span className="font-bold text-white text-lg">Easycao</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              A maior escola de preparacao para a prova ICAO do Brasil.
            </p>
            <div className="flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Prova ICAO */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80 mb-4">
              Prova ICAO
            </h3>
            <ul className="space-y-2">
              {corePages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {page.title.replace(/:.*/,"").replace(/\[.*\]/,"")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Metodo */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80 mb-4">
              Metodo
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/metodo"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Conhecer o Metodo
                </Link>
              </li>
              <li>
                <Link
                  href="/lives"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Lives Gratuitas
                </Link>
              </li>
              <li>
                <a
                  href={HOTMART_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Matricular
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contato */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/80 mb-4">
              Contato
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={WHATSAPP_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            Easycao &copy; {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
