"use client";

export default function NoAccess() {
  return (
    <div className="flex-1 flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-black mb-2">
          Você ainda não tem acesso
        </h2>
        <p className="text-sm text-black/50 mb-6 leading-relaxed">
          Para acessar o conteúdo da plataforma, você precisa adquirir o curso.
          Após a compra, seu acesso será liberado automaticamente.
        </p>
        <a
          href="https://easycao.com"
          className="inline-block px-6 py-3 rounded-full bg-primary hover:bg-[#1888e0] text-white font-bold text-sm shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300"
        >
          Conhecer o Curso
        </a>
      </div>
    </div>
  );
}
