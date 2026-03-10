"use client";

export default function ComingSoon({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/8 text-primary flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-black mb-2">{title}</h2>
        <p className="text-sm text-black/50">
          Essa funcionalidade estará disponível em breve.
        </p>
        <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full bg-primary/8 text-primary font-medium">
          Em breve
        </span>
      </div>
    </div>
  );
}
