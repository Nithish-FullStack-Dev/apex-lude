"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  reducedMotion: boolean;
}

export function LoadingScreen({
  onComplete,
  reducedMotion,
}: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("autostart") === "1" || reducedMotion) {
      setVisible(false);
      onComplete();
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 950);

    return () => window.clearTimeout(timer);
  }, [onComplete, reducedMotion]);

  const handleSkip = () => {
    setVisible(false);
    onComplete();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-charcoal)]"
          aria-label="Opening sequence"
        >
          <div className="relative overflow-hidden px-8 py-6">
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[var(--color-industrial-orange)]/20 to-transparent"
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="font-display text-4xl font-extrabold tracking-[0.18em] text-white sm:text-5xl">
                APEX
                <span className="text-[var(--color-industrial-orange)]">
                  LUBES
                </span>
              </span>
              <span className="font-mono-tech text-xs tracking-[0.28em] text-slate-400 uppercase">
                Engineered Protection · UAE
              </span>
            </motion.div>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="mt-6 border border-[var(--color-light-grey)]/15 px-4 py-2 text-xs font-medium tracking-wider text-[var(--color-light-grey)] transition-colors hover:border-[var(--color-industrial-orange)]/35 hover:text-[var(--color-industrial-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
