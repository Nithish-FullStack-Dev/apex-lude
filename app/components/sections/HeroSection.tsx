import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroScene } from '../three/HeroScene';
import { MagneticButton } from '../ui/MagneticButton';

interface HeroSectionProps {
  introDone: boolean;
  reducedMotion: boolean;
}

export function HeroSection({ introDone, reducedMotion }: HeroSectionProps) {
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="hero"
      className="relative flex min-h-[700px] items-center overflow-hidden bg-[var(--color-charcoal)] pt-20 pb-14 lg:min-h-[92vh] lg:pt-24 lg:pb-16"
    >
      {/* Subtle architectural technical grid & warm ambient depth */}
      <div className="bg-tech-grid pointer-events-none absolute inset-0 opacity-75" />
      <div
        className="pointer-events-none absolute right-[8%] top-[18%] h-[420px] w-[420px] rounded-full opacity-35 blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(242,140,40,0.38) 0%, rgba(242,140,40,0.12) 55%, rgba(0,0,0,0) 75%)' }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* Left Editorial Column */}
        <div className="min-w-0 lg:col-span-6">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: easeCurve }}
            className="font-mono-tech text-[11px] font-medium tracking-[0.12em] text-[var(--color-industrial-orange)] uppercase sm:text-xs sm:tracking-[0.22em]"
          >
            Advanced Lubrication Technology · Blended in UAE
          </motion.p>

          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08, ease: easeCurve }}
            className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white uppercase sm:text-6xl xl:text-[5.25rem]"
            style={{ textWrap: 'balance' }}
          >
            Engineered
            <br />
            to <span className="text-[var(--color-industrial-orange)]">Outperform.</span>
          </motion.h1>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16, ease: easeCurve }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            Precision lubrication. Engineered protection. Performance without compromise.
            Formulated in the UAE for passenger vehicles, heavy-duty fleets, and industrial plants.
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.24, ease: easeCurve }}
            className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <MagneticButton href="#products" variant="primary">
              <span>Explore Our Products</span>
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>

            <MagneticButton href="#technology" variant="secondary">
              <span>Discover Apex</span>
            </MagneticButton>
          </motion.div>

          {/* Grounded technical metadata line (no pill enclosures) */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 font-mono-tech text-xs text-slate-400"
          >
            <span>ISO 9001:2015</span>
            <span aria-hidden="true">·</span>
            <span>API &amp; SAE Aligned Formulations</span>
            <span aria-hidden="true">·</span>
            <span>Automotive &amp; Industrial Range</span>
          </motion.div>
        </div>

        {/* Right 3D Hero Container Stage */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={introDone ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.12, ease: easeCurve }}
          className="relative flex h-[360px] min-w-0 flex-col items-center justify-center sm:h-[460px] lg:col-span-6 lg:h-[580px]"
        >
          <HeroScene reducedMotion={reducedMotion} />
          <p className="pointer-events-none mt-1 font-mono-tech text-[11px] tracking-widest text-slate-500 uppercase">
            Move cursor to inspect 3D Apex container
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#technology"
        aria-label="Scroll to engine protection technology"
        className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium tracking-widest text-slate-400 uppercase transition-colors hover:text-white lg:inline-flex"
      >
        <span>Scroll</span>
        <ArrowDown className="h-3.5 w-3.5 text-[var(--color-industrial-orange)]" />
      </a>
    </section>
  );
}
