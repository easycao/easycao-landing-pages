"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getNextLive(): { date: Date; label: string } {
  // All times in Brasilia (UTC-3)
  const now = new Date();

  // Get current time in Brasilia
  const brasiliaOffset = -3 * 60; // minutes
  const localOffset = now.getTimezoneOffset(); // minutes
  const diffMinutes = brasiliaOffset + localOffset;
  const brasiliaTime = new Date(now.getTime() + diffMinutes * 60 * 1000);

  const dayOfWeek = brasiliaTime.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu
  const hours = brasiliaTime.getHours();
  const minutes = brasiliaTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  // Tuesday 19:00 = 1140 minutes, Thursday 13:30 = 810 minutes
  const tuesdayTime = 19 * 60; // 1140
  const thursdayTime = 13 * 60 + 30; // 810

  let daysUntil: number;
  let targetHour: number;
  let targetMinute: number;
  let label: string;

  if (dayOfWeek < 2 || (dayOfWeek === 2 && currentMinutes < tuesdayTime)) {
    // Before Tuesday 19:00 → next is Tuesday
    daysUntil = (2 - dayOfWeek + 7) % 7 || (currentMinutes < tuesdayTime ? 0 : 7);
    targetHour = 19;
    targetMinute = 0;
    label = "Aula ao Vivo — Terça 19h";
  } else if (
    dayOfWeek < 4 ||
    (dayOfWeek === 4 && currentMinutes < thursdayTime)
  ) {
    // Before Thursday 13:30 → next is Thursday
    daysUntil = (4 - dayOfWeek + 7) % 7 || (currentMinutes < thursdayTime ? 0 : 7);
    targetHour = 13;
    targetMinute = 30;
    label = "Simulado ICAO — Quinta 13h30";
  } else {
    // After Thursday 13:30 → next Tuesday
    daysUntil = (2 - dayOfWeek + 7) % 7 || 7;
    targetHour = 19;
    targetMinute = 0;
    label = "Aula ao Vivo — Terça 19h";
  }

  const target = new Date(brasiliaTime);
  target.setDate(target.getDate() + daysUntil);
  target.setHours(targetHour, targetMinute, 0, 0);

  // Convert back to local time for countdown calculation
  const targetLocal = new Date(target.getTime() - diffMinutes * 60 * 1000);

  return { date: targetLocal, label };
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [mounted, setMounted] = useState(false);
  const [nextLive, setNextLive] = useState(getNextLive);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const live = getNextLive();
    setNextLive(live);
    setTimeLeft(calcTimeLeft(live.date));

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= live.date) {
        const newLive = getNextLive();
        setNextLive(newLive);
        setTimeLeft(calcTimeLeft(newLive.date));
      } else {
        setTimeLeft(calcTimeLeft(live.date));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 mt-12">
        <p className="text-black/60 text-center font-medium text-sm">Carregando countdown...</p>
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: "DIAS" },
    { value: timeLeft.hours, label: "HORAS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEG" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 mt-12">
      <p className="text-black/60 text-center font-medium text-sm">
        Proxima live:
      </p>
      <p className="text-primary text-center font-semibold text-lg lg:text-xl mt-2">
        🔴 {nextLive.label}
      </p>

      <div className="flex justify-center gap-3 lg:gap-4 mt-6">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="bg-gray-light rounded-xl px-4 lg:px-6 py-3 lg:py-4 text-center min-w-[70px] lg:min-w-[90px]"
          >
            <span className="text-primary-dark font-extrabold text-3xl lg:text-5xl block">
              {String(block.value).padStart(2, "0")}
            </span>
            <span className="text-black/50 font-medium text-[10px] lg:text-xs uppercase tracking-wider">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
