"use client";

import { useCallback, useRef } from "react";

/**
 * Hook لتشغيل تنبيه صوتي عند استلام طلب جديد
 * يستخدم Web Audio API لإنشاء نغمة تنبيه بدون ملف خارجي
 */
export function useAudioAlert() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playAlert = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;

      // إنشاء نغمة تنبيه مكونة من 3 نبضات
      const playBeep = (startTime: number, freq: number, duration: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playBeep(now, 880, 0.15);
      playBeep(now + 0.2, 1100, 0.15);
      playBeep(now + 0.4, 880, 0.25);
    } catch (error) {
      console.warn("Audio alert not available:", error);
    }
  }, []);

  return { playAlert };
}
