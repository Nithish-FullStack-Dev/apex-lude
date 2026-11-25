"use client";

import { useEffect, useRef, useState } from "react";

const COMPANY_STATS = [
  {
    number: 200,
    label: "Happy Employees",
  },
  {
    number: 25,
    label: "Countries",
  },
  {
    number: 25,
    label: "Years of Success",
  },
];

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const startTime = performance.now();

    let animationFrame: number;

    const updateCounter = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrame);
  }, [started, target]);

  return <span ref={ref}>{count}</span>;
}

export function ManufacturingSection() {
  return (
    <section className="relative overflow-hidden border-t border-(--color-light-grey)/10 bg-(--color-charcoal) py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Heading */}
        <div className="mb-14 text-center">
          <p className="font-mono-tech text-xs font-medium tracking-[0.25em] text-(--color-industrial-orange) uppercase">
            Our Achievements
          </p>

          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl lg:text-5xl">
            Numbers That Define Us
          </h2>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {COMPANY_STATS.map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center justify-center px-6 py-10 text-center sm:py-8"
            >
              <h3 className="font-display text-6xl font-extrabold tracking-tight text-white transition-colors duration-300 group-hover:text-(--color-industrial-orange) sm:text-7xl lg:text-8xl">
                <Counter target={stat.number} />
                <span className="text-(--color-industrial-orange)">+</span>
              </h3>

              <p className="mt-4 font-mono-tech text-sm font-medium tracking-[0.15em] text-slate-400 uppercase sm:text-base">
                {stat.label}
              </p>

              <div className="mt-6 h-1 w-10 bg-(--color-industrial-orange) transition-all duration-300 group-hover:w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
