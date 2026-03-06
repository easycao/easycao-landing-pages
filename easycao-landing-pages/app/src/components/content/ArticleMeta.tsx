import { DIOGO } from "../../lib/constants";

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

interface ArticleMetaProps {
  updatedAt: string;
  readingTime: number;
}

export default function ArticleMeta({ updatedAt, readingTime }: ArticleMetaProps) {
  const date = new Date(updatedAt);
  const month = MONTHS_PT[date.getMonth()];
  const year = date.getFullYear();

  return (
    <div className="text-sm text-white/50 flex gap-4 flex-wrap mt-3">
      <span>Atualizado em {month} {year}</span>
      <span>{readingTime} min de leitura</span>
      <span>Por {DIOGO.name}</span>
    </div>
  );
}
