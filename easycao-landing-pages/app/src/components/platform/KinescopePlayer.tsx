"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface KinescopePlayerProps {
  videoId: string;
  studentEmail: string;
}

export default function KinescopePlayer({
  videoId,
  studentEmail,
}: KinescopePlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Build embed URL with watermark params
  const params = new URLSearchParams();
  if (studentEmail) {
    params.set("ui[watermark][text]", studentEmail);
    params.set("ui[watermark][mode]", "random");
    params.set("ui[watermark][scale]", "0.07");
    params.set("ui[watermark][displayTimeout][visible]", "1000");
    params.set("ui[watermark][displayTimeout][hidden]", "30000");
  }

  const embedUrl = `https://kinescope.io/embed/${videoId}?${params.toString()}`;

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        {/* Placeholder always behind iframe — visible until player renders */}
        <div
          className={`absolute inset-0 z-0 flex items-center justify-center ${
            isDark
              ? "border border-white/[0.09] backdrop-blur-[20px] backdrop-saturate-[1.4]"
              : "bg-white"
          }`}
          style={isDark ? { background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" } : undefined}
        >
          <div className={`w-8 h-8 border-2 rounded-full animate-spin ${
            isDark
              ? "border-white/10 border-t-primary"
              : "border-black/10 border-t-primary"
          }`} />
        </div>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full z-10"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; screen-wake-lock"
          allowFullScreen
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
