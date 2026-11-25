"use client";

// import { useState } from "react";
// import { ArrowUpRight } from "lucide-react";
// import { INDUSTRY_SECTORS, PRODUCT_CATEGORIES } from "../../data/apexData";

// interface IndustriesSectionProps {
//   onSelectProduct: (productId: string) => void;
// }

// export function IndustriesSection({ onSelectProduct }: IndustriesSectionProps) {
//   const [activeId, setActiveId] = useState(INDUSTRY_SECTORS[0].id);
//   const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

//   const activeSector =
//     INDUSTRY_SECTORS.find((s) => s.id === activeId) ?? INDUSTRY_SECTORS[0];

//   const handleJumpToProduct = (productTitle: string) => {
//     const match = PRODUCT_CATEGORIES.find((p) => p.title === productTitle);
//     if (match) {
//       onSelectProduct(match.id);
//       const el = document.getElementById("products");
//       if (el) el.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <section
//       id="industries"
//       className="border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-28"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-8">
//         <div className="max-w-3xl">
//           <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[var(--color-industrial-orange)] uppercase">
//             Cross-Sector Performance
//           </p>
//           <h2
//             className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white uppercase sm:text-5xl lg:text-6xl"
//             style={{ textWrap: "balance" }}
//           >
//             Powering Industries.
//             <br />
//             Protecting{" "}
//             <span className="text-[var(--color-industrial-orange)]">
//               Performance.
//             </span>
//           </h2>
//         </div>

//         <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-12">
//           {/* Interactive Editorial Sector List */}
//           <div className="flex min-w-0 flex-col divide-y divide-white/10 border-y border-white/10 lg:col-span-5">
//             {INDUSTRY_SECTORS.map((sector, idx) => {
//               const isSelected = sector.id === activeSector.id;
//               return (
//                 <button
//                   key={sector.id}
//                   type="button"
//                   onMouseEnter={() => setActiveId(sector.id)}
//                   onClick={() => setActiveId(sector.id)}
//                   aria-pressed={isSelected}
//                   className={`group flex items-center justify-between gap-4 px-4 py-5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)] ${
//                     isSelected
//                       ? "bg-[var(--color-charcoal)] text-[var(--color-light-grey)]"
//                       : "bg-transparent text-[var(--color-light-grey)]/70 hover:bg-[var(--color-charcoal)] hover:text-[var(--color-light-grey)]"
//                   }`}
//                 >
//                   <div>
//                     <div className="flex items-baseline gap-3">
//                       <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
//                         0{idx + 1}
//                       </span>
//                       <span className="font-display text-2xl font-bold tracking-wide uppercase sm:text-3xl">
//                         {sector.name}
//                       </span>
//                     </div>
//                     <p className="mt-1 pl-7 text-xs text-slate-400">
//                       {sector.subtitle}
//                     </p>
//                   </div>

//                   <ArrowUpRight
//                     className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
//                       isSelected
//                         ? "translate-x-0.5 -translate-y-0.5 text-[var(--color-industrial-orange)]"
//                         : "text-slate-600 group-hover:text-slate-300"
//                     }`}
//                   />
//                 </button>
//               );
//             })}
//           </div>

//           {/* Dynamic Industry Visual & Technical Scope */}
//           <div className="flex flex-col justify-between border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] lg:col-span-7">
//             <div className="relative h-64 overflow-hidden bg-[var(--color-charcoal)] sm:h-80 lg:h-96">
//               {imgErrorMap[activeSector.id] ? (
//                 <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-charcoal)] to-[var(--color-charcoal)] p-8">
//                   <span className="font-display text-4xl font-bold text-white uppercase">
//                     {activeSector.name}
//                   </span>
//                 </div>
//               ) : (
//                 <img
//                   key={activeSector.id}
//                   src={activeSector.imageUrl}
//                   alt={activeSector.imageAlt}
//                   referrerPolicy="no-referrer"
//                   onError={() =>
//                     setImgErrorMap((prev) => ({
//                       ...prev,
//                       [activeSector.id]: true,
//                     }))
//                   }
//                   className="h-full w-full object-cover transition-transform duration-700"
//                 />
//               )}
//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)] via-[var(--color-charcoal)]/30 to-transparent" />
//               <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-2">
//                 <div>
//                   <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
//                     {activeSector.subtitle}
//                   </span>
//                   <h3 className="font-display text-3xl font-extrabold text-white uppercase">
//                     {activeSector.name} Sector
//                   </h3>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 sm:p-8">
//               <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
//                 {activeSector.description}
//               </p>

//               <p className="mt-4 border-t border-white/10 pt-4 font-mono-tech text-xs text-[var(--color-industrial-orange)]">
//                 {activeSector.operatingFocus}
//               </p>

//               <div className="mt-5 flex flex-wrap items-center gap-2">
//                 <span className="mr-2 text-xs font-medium text-slate-400">
//                   Applicable Lines:
//                 </span>
//                 {activeSector.recommendedLines.map((line) => (
//                   <button
//                     key={line}
//                     type="button"
//                     onClick={() => handleJumpToProduct(line)}
//                     className="border border-white/15 bg-[var(--color-charcoal)] px-3 py-1.5 text-xs font-medium text-[var(--color-light-grey)] transition-colors hover:border-[var(--color-industrial-orange)]/60 hover:text-[var(--color-light-grey)]"
//                   >
//                     {line}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface Industry {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  operatingFocus: string;
  recommendedLines: string[];
  imageUrl: string;
  imageAlt: string;
}

interface Metrics {
  vh: number;
  rowTops: number[];
  travel: number;
  riseLen: number;
  contentLen: number;
  exitLen: number;
  length: number;
}

interface Timeline {
  sectionHeight: string;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  rowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  metrics: React.MutableRefObject<Metrics>;
  scrollPx: MotionValue<number>;
  layoutTick: MotionValue<number>;
  sheetY: MotionValue<string>;
  sheetRotate: MotionValue<number>;
  sheetScale: MotionValue<number>;
  sheetRadius: MotionValue<string>;
  contentY: MotionValue<number>;
  lineOneOpacity: MotionValue<number>;
  lineTwoOpacity: MotionValue<number>;
  backgroundScale: MotionValue<number>;
  backgroundOpacity: MotionValue<number>;
}

interface IndustryRowProps {
  item: Industry;
  index: number;
  timeline: Timeline;
  rowRef: (element: HTMLDivElement | null) => void;
}

interface Industry {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  operatingFocus: string;
  recommendedLines: string[];
  imageUrl: string;
  imageAlt: string;
}

const industries: Industry[] = [
  {
    id: "automotive",
    name: "Automotive",
    subtitle: "Passenger Vehicles, SUVs & Motorcycles",
    description:
      "From modern multi-valve petrol engines to high-revving 4T motorcycles, Apex automotive lubricants are blended to protect against sludge, thermal shear, and cold-start wear.",
    operatingFocus:
      "API SN / SM / SL Petrol & 4T Formulations · ATF Dexron III · DOT 4",
    recommendedLines: [
      "Gasoline Engine Oils",
      "Motorcycle Oils",
      "Gear & Transmission Oils",
      "Coolants & Brake Fluids",
    ],
    imageUrl:
      "/assets/images/industry_automotive_performance_1795415831855.jpg",
    imageAlt:
      "Twin-turbo V8 automotive engine assembly in a dark precision studio",
  },
  {
    id: "heavy-duty",
    name: "Heavy Duty",
    subtitle: "Commercial Trucking, Logistics & Transit Fleets",
    description:
      "Turbocharged diesel fleets operating across high ambient Middle East and global corridors rely on high-TBN oil chemistry to manage soot dispersion and extended service loads.",
    operatingFocus: "API CJ-4 / CI-4 / CH-4 Turbo Diesel · SAE 15W-40 & 20W-50",
    recommendedLines: [
      "Diesel Engine Oils",
      "Gear & Transmission Oils",
      "Greases",
      "Coolants & Brake Fluids",
    ],
    imageUrl: "/assets/images/industry_marine_heavy_duty_1795415832876.jpg",
    imageAlt: "Heavy-duty diesel engine block and high-pressure fluid manifold",
  },
  {
    id: "construction",
    name: "Construction",
    subtitle: "Earthmoving, Cranes & Site Hydraulics",
    description:
      "Excavators, loaders, and mobile cranes demand anti-wear hydraulic fluids and extreme-pressure lithium greases that hold film integrity under shock loads and dust exposure.",
    operatingFocus:
      "ISO VG 46 / 68 Anti-Wear Hydraulic · Lithium EP2 / EP3 Greases",
    recommendedLines: ["Hydraulic Oils", "Diesel Engine Oils", "Greases"],
    imageUrl: "/assets/images/industry_heavy_industrial_1795415832052.jpg",
    imageAlt:
      "Heavy-duty industrial hydraulic turbine and planetary gear assembly",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    subtitle: "Plant Machinery, Turbines & Metalworking",
    description:
      "Continuous factory lines require specialized compressor, turbine, transformer, heat transfer, and metal cutting oils formulated for thermal stability and reduced downtime.",
    operatingFocus:
      "Compressor, Turbine, Heat Transfer & Cutting Oils · ISO VG 32–220",
    recommendedLines: ["Industrial Lubricants", "Hydraulic Oils", "Greases"],
    imageUrl: "/assets/images/manufacturing_blending_plant_1795415831959.jpg",
    imageAlt:
      "Automated stainless steel industrial blending vessels and precision piping",
  },
  {
    id: "marine",
    name: "Marine",
    subtitle: "Commercial Vessels & Outboard Propulsion",
    description:
      "Marine diesel trunk-piston lubricants and TC-W3 outboard oils engineered to combat moisture ingress, acid neutralization, and sustained saltwater operating demands.",
    operatingFocus:
      "Marine Engine Oils · TC-W3 Outboard · Anti-Corrosion Greases",
    recommendedLines: [
      "Industrial Lubricants",
      "Motorcycle Oils",
      "Diesel Engine Oils",
    ],
    imageUrl: "/assets/images/industry_marine_heavy_duty_1795415832876.jpg",
    imageAlt:
      "Commercial maritime propulsion engine room and stainless steel manifolds",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    subtitle: "Tractors, Harvesters & Irrigation Drives",
    description:
      "Super Tractor Oil Universal (STOU SAE 15W-40) and multipurpose agricultural lubricants simplify fleet maintenance across engines, transmissions, and wet brakes.",
    operatingFocus: "Tractor Oil STOU SAE 15W-40 · Calcium MP2 / MP3 Greases",
    recommendedLines: [
      "Diesel Engine Oils",
      "Hydraulic Oils",
      "Gear & Transmission Oils",
      "Greases",
    ],
    imageUrl: "/assets/images/industry_heavy_industrial_1795415832052.jpg",
    imageAlt:
      "High-torque planetary gear drive and heavy agricultural transmission assembly",
  },
];

const SHEET_RADIUS = 28;
const SHEET_ENTER_SHIFT = 1.15;
const SHEET_EXIT_SHIFT = 1.2;
const SHEET_ENTER_ROTATE = 7;
const SHEET_EXIT_ROTATE = 6.5;
const SHEET_SCALE_DROP = 0.12;
const RISE_LENGTH = 0.9;
const EXIT_LENGTH = 0.9;
const CONTENT_SPEED = 1.15;
const ROW_APPEAR_FROM = 0.9;
const ROW_ENTER_FROM = 0.745;
const ROW_ENTER_TO = 0.425;
const ROW_SETTLE = 0.4;
const ROW_SHIFT_VW = 12;
const ROW_MIN_OPACITY = 0.25;
const ROW_MIN_SCALE = 0.3;

const emptyMetrics: Metrics = {
  vh: 0,
  rowTops: [],
  travel: 0,
  riseLen: 0,
  contentLen: 0,
  exitLen: 0,
  length: 0,
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const range = (value: number, from: number, to: number) =>
  to <= from ? 0 : clamp((value - from) / (to - from));

const lift = (rise: number) => Math.pow(1 - rise, 1.8);

const getPhases = (scroll: number, m: Metrics) => ({
  rise: range(scroll, 0, m.riseLen),
  travel: range(scroll, m.riseLen, m.riseLen + m.contentLen),
  exit: range(scroll, m.riseLen + m.contentLen, m.length),
});

const sheetShiftAt = (scroll: number, m: Metrics) => {
  const { rise, exit } = getPhases(scroll, m);
  return (
    SHEET_ENTER_SHIFT * lift(rise) - SHEET_EXIT_SHIFT * Math.pow(exit, 1.3)
  );
};

const contentShiftAt = (scroll: number, m: Metrics) =>
  -m.travel * getPhases(scroll, m).travel;

const useTimelineValue = <T,>(
  scrollPx: MotionValue<number>,
  layoutTick: MotionValue<number>,
  metrics: React.MutableRefObject<Metrics>,
  compute: (scroll: number, m: Metrics) => T,
) =>
  useTransform([scrollPx, layoutTick], ([scroll]: number[]) =>
    compute(scroll, metrics.current),
  );

const useSheetTimeline = (
  sectionRef: React.RefObject<HTMLElement | null>,
): Timeline => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metrics = useRef<Metrics>(emptyMetrics);
  const layoutTick = useMotionValue(0);
  const [sectionHeight, setSectionHeight] = useState("400vh");

  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const vh = sheet.offsetHeight;
    const rowTops = rowRefs.current.map((row) => (row ? row.offsetTop : 0));
    const lastTop = rowTops.reduce((max, value) => Math.max(max, value), 0);
    const travel = Math.max(0, lastTop - vh * ROW_SETTLE);
    const riseLen = vh * RISE_LENGTH;
    const contentLen = travel * CONTENT_SPEED;
    const exitLen = vh * EXIT_LENGTH;
    const length = riseLen + contentLen + exitLen;

    metrics.current = {
      vh,
      rowTops,
      travel,
      riseLen,
      contentLen,
      exitLen,
      length,
    };

    setSectionHeight(`${Math.round(vh + length)}px`);
    layoutTick.set(layoutTick.get() + 1);
  }, [layoutTick]);

  useEffect(() => {
    measure();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;

    if (observer) {
      if (sheetRef.current) observer.observe(sheetRef.current);
      if (contentRef.current) observer.observe(contentRef.current);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }

    window.addEventListener("load", measure);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("load", measure);
    };
  }, [measure]);

  const rawScroll = useTransform([scrollY, layoutTick], () => {
    const section = sectionRef.current;
    if (!section) return 0;
    return clamp(
      -section.getBoundingClientRect().top,
      0,
      metrics.current.length,
    );
  });

  const scrollPx = useSpring(rawScroll, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  const sheetY = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => `${sheetShiftAt(scroll, m) * 100}vh`,
  );

  const sheetRotate = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => {
      const { rise, exit } = getPhases(scroll, m);
      return SHEET_ENTER_ROTATE * lift(rise) - SHEET_EXIT_ROTATE * exit;
    },
  );

  const sheetScale = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => {
      const { rise, exit } = getPhases(scroll, m);
      return 1 - SHEET_SCALE_DROP * lift(rise) - SHEET_SCALE_DROP * exit;
    },
  );

  const sheetRadius = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => {
      const { rise, exit } = getPhases(scroll, m);
      const radius =
        SHEET_RADIUS * (1 - range(rise, 0.75, 1) + range(exit, 0, 0.3));
      return `${radius}px`;
    },
  );

  const contentY = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => contentShiftAt(scroll, m),
  );

  const lineOneOpacity = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => range(getPhases(scroll, m).rise, 0.1, 0.55),
  );

  const lineTwoOpacity = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => range(getPhases(scroll, m).rise, 0.3, 0.8),
  );

  const backgroundAmount = useTimelineValue(
    scrollPx,
    layoutTick,
    metrics,
    (scroll, m) => {
      const { rise, exit } = getPhases(scroll, m);
      return rise * (1 - exit);
    },
  );

  const backgroundScale = useTransform(
    backgroundAmount,
    (amount) => 1 - 0.04 * amount,
  );

  const backgroundOpacity = useTransform(
    backgroundAmount,
    (amount) => 1 - 0.4 * amount,
  );

  return {
    sectionHeight,
    sheetRef,
    contentRef,
    rowRefs,
    metrics,
    scrollPx,
    layoutTick,
    sheetY,
    sheetRotate,
    sheetScale,
    sheetRadius,
    contentY,
    lineOneOpacity,
    lineTwoOpacity,
    backgroundScale,
    backgroundOpacity,
  };
};

const IndustriesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timeline = useSheetTimeline(sectionRef);

  return (
    <section
      ref={sectionRef}
      style={{ height: timeline.sectionHeight }}
      className="relative bg-[var(--color-charcoal)]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{
            scale: timeline.backgroundScale,
            opacity: timeline.backgroundOpacity,
          }}
          className="absolute inset-0 flex flex-col justify-center px-5 md:px-10 lg:px-16"
        >
          <div className="max-w-[1500px] mx-auto w-full">
            <p className="mb-5 text-xs uppercase tracking-[0.25em] text-white/20">
              Cross-Sector Performance
            </p>

            <h1 className="max-w-6xl font-display text-[clamp(3.2rem,7vw,8rem)] font-bold leading-[0.9] tracking-[-0.045em] text-white">
              Powering Industries.
              <br />
              Protecting Performance.
            </h1>
          </div>
        </motion.div>

        <motion.div
          ref={timeline.sheetRef}
          style={{
            y: timeline.sheetY,
            rotate: timeline.sheetRotate,
            scale: timeline.sheetScale,
            borderRadius: timeline.sheetRadius,
            transformOrigin: "50% 50%",
          }}
          className="absolute inset-x-0 top-0 h-screen overflow-hidden bg-[#f7f7f3] shadow-[0_-20px_80px_rgba(0,0,0,0.18)] will-change-transform"
        >
          <motion.div
            ref={timeline.contentRef}
            style={{ y: timeline.contentY }}
            className="relative px-[5vw] pb-40 pt-[10vh] text-[#121212] will-change-transform"
          >
            <div className="mb-[18vh] flex items-start justify-between gap-10">
              <div>
                <p className="mb-4 text-[15px] uppercase tracking-[0.2em] text-black/70">
                  Industries
                </p>

                <h2 className="max-w-5xl font-display text-[clamp(3rem,6.5vw,7rem)] font-bold leading-[0.88] tracking-[-0.05em] text-(--color-industrial-orange)">
                  <motion.span
                    style={{ opacity: timeline.lineOneOpacity }}
                    className="block"
                  >
                    Built to perform
                  </motion.span>
                  <motion.span
                    style={{ opacity: timeline.lineTwoOpacity }}
                    className="block"
                  >
                    across industries.
                  </motion.span>
                </h2>
              </div>

              <p className="hidden max-w-[280px] pt-8 text-md leading-6 text-black/70 lg:block">
                Engineered solutions designed to protect performance across
                demanding operating environments.
              </p>
            </div>

            <div className="border-t border-black/15">
              {industries.map((industry, index) => (
                <IndustryRow
                  key={index}
                  item={industry}
                  index={index}
                  timeline={timeline}
                  rowRef={(element) => {
                    timeline.rowRefs.current[index] = element;
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const IndustryRow = ({ item, index, timeline, rowRef }: IndustryRowProps) => {
  const { scrollPx, layoutTick, metrics } = timeline;

  const top = useTimelineValue(scrollPx, layoutTick, metrics, (scroll, m) => {
    if (!m.vh) return 2;
    return (
      ((m.rowTops[index] ?? 0) + contentShiftAt(scroll, m)) / m.vh +
      sheetShiftAt(scroll, m)
    );
  });

  const enter = useTransform(top, (value) =>
    clamp((ROW_ENTER_FROM - value) / (ROW_ENTER_FROM - ROW_ENTER_TO)),
  );

  const rowOpacity = useTransform(
    [top, enter],
    ([value, entered]: number[]) => {
      const appear = clamp(
        (ROW_APPEAR_FROM - value) / (ROW_APPEAR_FROM - ROW_ENTER_FROM),
      );
      return appear * mix(ROW_MIN_OPACITY, 1, clamp(entered / 0.7));
    },
  );

  const textX = useTransform(
    enter,
    (entered) => `${(1 - entered) * ROW_SHIFT_VW}vw`,
  );

  const descriptionX = useTransform(
    enter,
    (entered) => `${-(1 - entered) * ROW_SHIFT_VW}vw`,
  );

  const imageScale = useTransform(enter, (entered) =>
    mix(ROW_MIN_SCALE, 1, entered),
  );

  return (
    <motion.div
      ref={rowRef}
      style={{ opacity: rowOpacity }}
      className="grid min-h-[42vh] grid-cols-1 items-center gap-10 border-b border-black/15 py-14 md:grid-cols-[1fr_0.75fr_1fr] md:gap-8 lg:gap-16"
    >
      <motion.div style={{ x: textX }}>
        <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-black/35">
          {String(index + 1).padStart(2, "0")}
        </p>

        <h3 className="font-display text-[clamp(2.4rem,4vw,5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-(--color-industrial-orange)">
          {item.name}
        </h3>

        <p className="mt-4 max-w-[420px] text-sm font-medium leading-6 text-black/45 lg:text-base font-mono">
          {item.subtitle}
        </p>
      </motion.div>

      <div className="flex justify-center overflow-visible">
        <motion.div
          style={{ scale: imageScale }}
          className="relative aspect-[3/2] w-full max-w-[260px] overflow-hidden rounded-sm md:max-w-[220px] lg:max-w-[300px]"
        >
          <motion.img
            src={item.imageUrl}
            alt={item.imageAlt}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </motion.div>
      </div>

      <motion.div style={{ x: descriptionX }} className="md:pl-4">
        <p className="max-w-[460px] text-base leading-7 text-black/70 lg:text-lg lg:leading-8 font-mono">
          {item.description}
        </p>

        <div className="mt-6 border-t border-black/10 pt-5">
          <p className="mb-2 text-[9px] font-semibold uppercase font-mono tracking-[0.18em] text-black/30">
            Operating Focus
          </p>

          <p className="max-w-[460px] text-xs font-medium leading-5 text-black/55 lg:text-sm lg:leading-6 font-mono">
            {item.operatingFocus}
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-black/30">
            Recommended Lines
          </p>

          <div className="flex max-w-[480px] flex-wrap gap-2">
            {item.recommendedLines.map((line) => (
              <span
                key={line}
                className="rounded-full border border-black/15 px-3 py-1.5 text-[10px] font-medium text-black/70 lg:text-xs font-mono"
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IndustriesSection;
