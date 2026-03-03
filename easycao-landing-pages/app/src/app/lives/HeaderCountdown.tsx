"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function getNextLive() {
  const now = new Date();
  const brasiliaOffset = -3 * 60;
  const localOffset = now.getTimezoneOffset();
  const diffMinutes = brasiliaOffset + localOffset;
  const brasiliaTime = new Date(now.getTime() + diffMinutes * 60 * 1000);

  const dayOfWeek = brasiliaTime.getDay();
  const hours = brasiliaTime.getHours();
  const minutes = brasiliaTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const tuesdayTime = 19 * 60;
  const thursdayTime = 13 * 60 + 30;

  let daysUntil: number;
  let targetHour: number;
  let targetMinute: number;
  let label: string;

  if (dayOfWeek < 2 || (dayOfWeek === 2 && currentMinutes < tuesdayTime)) {
    daysUntil = (2 - dayOfWeek + 7) % 7 || (currentMinutes < tuesdayTime ? 0 : 7);
    targetHour = 19;
    targetMinute = 0;
    label = "Aula ao Vivo — Terça 19h";
  } else if (dayOfWeek < 4 || (dayOfWeek === 4 && currentMinutes < thursdayTime)) {
    daysUntil = (4 - dayOfWeek + 7) % 7 || (currentMinutes < thursdayTime ? 0 : 7);
    targetHour = 13;
    targetMinute = 30;
    label = "Simulado ICAO — Quinta 13h30";
  } else {
    daysUntil = (2 - dayOfWeek + 7) % 7 || 7;
    targetHour = 19;
    targetMinute = 0;
    label = "Aula ao Vivo — Terça 19h";
  }

  const target = new Date(brasiliaTime);
  target.setDate(target.getDate() + daysUntil);
  target.setHours(targetHour, targetMinute, 0, 0);
  const targetLocal = new Date(target.getTime() - diffMinutes * 60 * 1000);

  return { date: targetLocal, label };
}

export default function HeaderCountdown() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [label, setLabel] = useState("");

  useEffect(() => {
    setMounted(true);
    const live = getNextLive();
    setLabel(live.label);

    function update() {
      const diff = Math.max(0, live.date.getTime() - Date.now());
      setTime({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { value: time.d, label: "DIAS" },
    { value: time.h, label: "HRS" },
    { value: time.m, label: "MINS" },
    { value: time.s, label: "SEGS" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
        {/* Logo — desktop only */}
        <div className="hidden sm:flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Easycao"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-bold text-base lg:text-lg text-primary">Easycao</span>
        </div>

        {mounted && (
          <div className="flex items-center justify-center gap-2 lg:gap-5 mx-auto sm:mx-0 h-full">
            <div className="flex items-center gap-1 lg:gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-black/70 text-[8px] lg:text-sm font-semibold uppercase tracking-wide whitespace-nowrap leading-none">
                A próxima aula começa em
              </span>
            </div>

            <div className="flex items-center gap-1 lg:gap-3">
              {units.map((u) => (
                <div key={u.label} className="flex items-baseline gap-px lg:gap-0.5 leading-none">
                  <span className="text-primary-dark font-bold text-sm lg:text-2xl tabular-nums leading-none">
                    {String(u.value).padStart(2, "0")}
                  </span>
                  <span className="text-black/50 font-semibold text-[8px] lg:text-sm uppercase leading-none">
                    {u.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
