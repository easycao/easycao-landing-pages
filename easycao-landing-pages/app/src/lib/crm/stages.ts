import type { StageName } from "./types";

export const STAGE_THRESHOLDS: Record<StageName, number> = {
  dia_10: 10,
  mes_2: 30,
  mes_4: 90,
  mes_7: 180,
  mes_10: 270,
};

export const MESSAGE_STAGES: StageName[] = [
  "dia_10",
  "mes_2",
  "mes_4",
  "mes_7",
  "mes_10",
];

const ALL_STAGES: [string, number][] = [
  ["dia_0", 0],
  ["dia_10", 10],
  ["mes_2", 30],
  ["mes_3", 60],
  ["mes_4", 90],
  ["mes_5", 120],
  ["mes_6", 150],
  ["mes_7", 180],
  ["mes_8", 210],
  ["mes_9", 240],
  ["mes_10", 270],
  ["mes_11", 300],
  ["mes_12", 330],
  ["antigo_aluno", 365],
];

export function computeStage(enrolledAt: Date): string {
  const days = Math.floor(
    (Date.now() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Walk backwards through stages to find the current one
  for (let i = ALL_STAGES.length - 1; i >= 0; i--) {
    if (days >= ALL_STAGES[i][1]) {
      return ALL_STAGES[i][0];
    }
  }

  return "dia_0";
}

export function daysRemaining(enrolledAt: Date): number {
  const days = Math.floor(
    (Date.now() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, 365 - days);
}
