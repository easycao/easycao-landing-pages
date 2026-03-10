"use client";

import dynamic from "next/dynamic";

const KinescopePlayerComponent = dynamic(
  () => import("@kinescope/react-kinescope-player"),
  { ssr: false }
);

interface KinescopePlayerProps {
  videoId: string;
  studentEmail: string;
}

export default function KinescopePlayer({
  videoId,
  studentEmail,
}: KinescopePlayerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg" onContextMenu={(e) => e.preventDefault()}>
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          <KinescopePlayerComponent
            videoId={videoId}
            watermark={
              studentEmail
                ? {
                    text: studentEmail,
                    mode: "random" as const,
                    scale: 0.07,
                    displayTimeout: { visible: 1000, hidden: 30000 },
                  }
                : undefined
            }
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
