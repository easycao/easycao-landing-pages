import type { EngagementLevel, StageName } from "./types";

export const MESSAGE_STAGES: StageName[] = [
  "dia_10",
  "mes_2",
  "mes_4",
  "mes_7",
  "mes_10",
];

function isMediumPlus(e: EngagementLevel): boolean {
  return e === "MEDIUM" || e === "HIGH" || e === "VERY_HIGH";
}

export function selectTemplate(
  stage: StageName,
  currentEngagement: EngagementLevel,
  prevEngagement?: EngagementLevel | null
): string {
  switch (stage) {
    case "dia_10":
      return currentEngagement === "NONE"
        ? "cs_dia_10_none"
        : "cs_dia10_other_engagement";

    case "mes_2":
      if (currentEngagement === "NONE") return "cs_1mes_none";
      if (currentEngagement === "LOW") return "cs_1_mes_low";
      return "cs_1mes_medium_to_very_high";

    case "mes_4": {
      if (currentEngagement === "NONE") return "cs_3meses_none";
      if (!prevEngagement || prevEngagement === "NONE")
        return "cs_3_meses_melhorou_do_none";
      if (currentEngagement === "LOW" && prevEngagement === "LOW")
        return "cs_3_meses_low_to_low";
      if (currentEngagement !== "LOW" && prevEngagement === "LOW")
        return "cs_3_meses_low_to_mediumplus";
      if (currentEngagement === "LOW" && isMediumPlus(prevEngagement))
        return "cs_3_meses_other_to_low";
      return "cs_3meses_mediumplus_to_mediumplus";
    }

    case "mes_7":
      return currentEngagement === "NONE"
        ? "cs_7meses_none"
        : "cs_7mes_lowplus";

    case "mes_10":
      return currentEngagement === "NONE"
        ? "cs_9meses_none"
        : "cs_9meses_lowplus";
  }
}
