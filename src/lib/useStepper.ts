import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./hooks";

export const SPEEDS = [0.5, 1, 2, 4] as const;
export type Speed = (typeof SPEEDS)[number];

/** A full run takes roughly this long at 1× speed, however many steps it has. */
const BASE_RUN_SECONDS = 4;
const MIN_STEPS_PER_SECOND = 3;

export interface Stepper {
  step: number;
  total: number;
  playing: boolean;
  speed: Speed;
  setSpeed: (s: Speed) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  next: () => void;
  prev: () => void;
  finish: () => void;
}

/**
 * Drives a step-by-step algorithm replay.
 * `step` is how many operations have been executed so far (0..total).
 * When `total` changes (the input size changed) the run snaps to its finished state.
 */
export function useStepper(total: number, startAt: "end" | "start" = "end"): Stepper {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(startAt === "end" ? total : 0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Input size changed: snap to the finished run for the new size (adjusting state during render).
  const [prevTotal, setPrevTotal] = useState(total);
  if (prevTotal !== total) {
    setPrevTotal(total);
    setStep(startAt === "end" ? total : 0);
    setPlaying(false);
  }

  useEffect(() => {
    if (!playing) return;
    const perSecond = Math.max(MIN_STEPS_PER_SECOND, total / BASE_RUN_SECONDS) * speed;
    let last = performance.now();
    let acc = 0;
    let raf = 0;
    const tick = (now: number) => {
      acc += ((now - last) / 1000) * perSecond;
      last = now;
      const whole = Math.floor(acc);
      if (whole > 0) {
        acc -= whole;
        const next = Math.min(total, stepRef.current + whole);
        stepRef.current = next;
        setStep(next);
        if (next >= total) {
          setPlaying(false);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, total, speed]);

  const play = useCallback(() => {
    if (reduced) {
      setStep(total);
      return;
    }
    setStep((s) => (s >= total ? 0 : s));
    setPlaying(true);
  }, [reduced, total]);

  const pause = useCallback(() => setPlaying(false), []);
  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);
  const next = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.min(total, s + 1));
  }, [total]);
  const prev = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.max(0, s - 1));
  }, []);
  const finish = useCallback(() => {
    setPlaying(false);
    setStep(total);
  }, [total]);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  return { step: Math.min(step, total), total, playing, speed, setSpeed, play, pause, toggle, reset, next, prev, finish };
}
