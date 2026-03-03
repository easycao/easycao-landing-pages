import { ReactNode } from "react";

interface CalloutBoxProps {
  variant: "info" | "warning" | "tip";
  title?: string;
  children: ReactNode;
}

const styles = {
  info: {
    bg: "bg-primary/5",
    border: "border-l-4 border-primary",
    icon: (
      <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-l-4 border-amber-500",
    icon: (
      <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  tip: {
    bg: "bg-emerald-50",
    border: "border-l-4 border-emerald-500",
    icon: (
      <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
};

export default function CalloutBox({ variant, title, children }: CalloutBoxProps) {
  const s = styles[variant];

  return (
    <div className={`${s.bg} ${s.border} rounded-r-xl p-4 my-6`}>
      <div className="flex gap-3">
        {s.icon}
        <div>
          {title && (
            <p className="font-semibold text-black mb-1">{title}</p>
          )}
          <div className="text-sm text-black/70 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
