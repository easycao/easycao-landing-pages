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

// Stages where thresholds shift by extensionDays (mes_7 onwards)
const EXTENSION_SHIFT_FROM = 180; // mes_7 threshold

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

export function computeStage(enrolledAt: Date, extensionDays = 0): string {
  const days = Math.floor(
    (Date.now() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Build adjusted thresholds: stages from mes_7 onwards shift by extensionDays
  const adjusted = ALL_STAGES.map(([name, threshold]) => [
    name,
    threshold >= EXTENSION_SHIFT_FROM ? threshold + extensionDays : threshold,
  ] as [string, number]);

  // Walk backwards through stages to find the current one
  for (let i = adjusted.length - 1; i >= 0; i--) {
    if (days >= adjusted[i][1]) {
      return adjusted[i][0];
    }
  }

  return "dia_0";
}

export function daysRemaining(enrolledAt: Date, extensionDays = 0): number {
  const days = Math.floor(
    (Date.now() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, 365 + extensionDays - days);
}

/**
 * For message stages that count backwards (mes_7, mes_10),
 * compute the threshold using extension-adjusted dates.
 * For early stages (dia_10, mes_2, mes_4), use original thresholds.
 */
export function getMessageThreshold(stageName: StageName, extensionDays = 0): number {
  const base = STAGE_THRESHOLDS[stageName];
  return base >= EXTENSION_SHIFT_FROM ? base + extensionDays : base;
}
