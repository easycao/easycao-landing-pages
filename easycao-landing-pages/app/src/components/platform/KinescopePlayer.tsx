"use client";

import { useState } from "react";

interface KinescopePlayerProps {
  videoId: string;
  studentEmail: string;
}

export default function KinescopePlayer({
  videoId,
  studentEmail,
}: KinescopePlayerProps) {
  const [loaded, setLoaded] = useState(false);

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
      className="relative rounded-2xl overflow-hidden bg-black shadow-lg"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; screen-wake-lock"
          allowFullScreen
          style={{ border: 0 }}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
