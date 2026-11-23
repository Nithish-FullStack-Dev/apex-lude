"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  button: string;
  href: string;
  image: string;
  objectPosition?: string;
};

const slides: Slide[] = [
  {
    id: "engine",
    eyebrow: "LUBRICANTS",
    title: "Engine Oil",
    description:
      "Advanced lubrication engineered to protect critical engine components, reduce friction and maintain dependable performance.",
    button: "Explore Engine Oil",
    href: "#",
    image: "/assets/images/1.png",
    objectPosition: "center",
  },
  {
    id: "diesel",
    eyebrow: "LUBRICANTS",
    title: "Diesel Oil",
    description:
      "Heavy-duty protection developed for demanding diesel engines, extended operating conditions and reliable performance.",
    button: "Explore Diesel Oil",
    href: "#",
    image: "/assets/images/2.png",
    objectPosition: "center",
  },
  {
    id: "gear",
    eyebrow: "LUBRICANTS",
    title: "Gear Oil",
    description:
      "Premium gear lubrication designed for excellent load carrying capability, smooth operation and lasting protection.",
    button: "Explore Gear Oil",
    href: "#",
    image: "/assets/images/3.png",
    objectPosition: "center",
  },
  {
    id: "hydraulic",
    eyebrow: "LUBRICANTS",
    title: "Hydraulic Oil",
    description:
      "Reliable hydraulic protection delivering consistent performance, thermal stability and efficient power transmission.",
    button: "Explore Hydraulic Oil",
    href: "#",
    image: "/assets/images/4.png",
    objectPosition: "center",
  },
  {
    id: "transmission",
    eyebrow: "LUBRICANTS",
    title: "Transmission Oil",
    description:
      "Advanced transmission lubrication formulated for smooth shifting, thermal stability and long-lasting protection.",
    button: "Explore Transmission Oil",
    href: "#",
    image: "/assets/images/5.png",
    objectPosition: "center",
  },
];

const BASE_ZOOM_IN = 0.018;
const VELOCITY_ZOOM_IN = 0.024;
const BASE_ZOOM_OUT = 0.01;
const VELOCITY_ZOOM_OUT = 0.016;
const VELOCITY_FOR_MAX_ZOOM = 1200;
const SCALE_SMOOTHING = 0.18;

export default function LubricantScrollCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentTrackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageInnerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const contentTrack = contentTrackRef.current;

    if (!section || !contentTrack) return;

    const context = gsap.context(() => {
      const transitionCount = slides.length - 1;

      // const renderedScales = slides.map(() => 1);

      imageRefs.current.forEach((image, index) => {
        if (!image) return;

        gsap.set(image, {
          clipPath: "inset(0% 0% 0% 0%)",
          WebkitClipPath: "inset(0% 0% 0% 0%)",
          zIndex: slides.length - index,
          force3D: true,
        });
      });

      imageInnerRefs.current.forEach((image) => {
        if (!image) return;

        gsap.set(image, {
          scale: 1,
          transformOrigin: "50% 50%",
          force3D: true,
        });
      });

      gsap.set(contentTrack, {
        yPercent: 0,
        force3D: true,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "none",
        },

        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * transitionCount * 0.9}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const rawProgress = self.progress * transitionCount;

            if (progressRef.current) {
              gsap.set(progressRef.current, {
                scaleX: self.progress,
              });
            }

            const nextIndex = Math.min(
              slides.length - 1,
              Math.max(0, Math.round(rawProgress)),
            );

            if (nextIndex !== activeIndexRef.current) {
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
            }

            let segmentIndex = Math.floor(rawProgress);

            if (segmentIndex >= transitionCount) {
              segmentIndex = transitionCount - 1;
            }

            segmentIndex = Math.max(0, segmentIndex);

            let localProgress = rawProgress - segmentIndex;

            if (self.progress >= 0.9999) {
              localProgress = 1;
            }

            localProgress = gsap.utils.clamp(0, 1, localProgress);

            const velocity = Math.abs(self.getVelocity());

            const speedStrength = gsap.utils.clamp(0, 1, velocity / 1400);

            const revealStrength = Math.sin(localProgress * Math.PI);

            const motionStrength = 0.45 + speedStrength * 0.55;

            imageInnerRefs.current.forEach((image, index) => {
              if (!image) return;

              let targetScale = 1;

              if (self.direction === 1) {
                const revealIndex = Math.min(
                  segmentIndex + 1,
                  slides.length - 1,
                );

                if (index === revealIndex) {
                  targetScale = 1 + 0.045 * revealStrength * motionStrength;
                }
              }

              if (self.direction === -1) {
                const revealIndex = Math.max(0, segmentIndex);

                if (index === revealIndex) {
                  targetScale = 1 - 0.025 * revealStrength * motionStrength;
                }
              }

              gsap.to(image, {
                scale: targetScale,
                duration: 0.22,
                ease: "power2.out",
                overwrite: true,
              });
            });
          },
        },
      });

      const finalTrackY = -(((slides.length - 1) / slides.length) * 100);

      timeline.to(
        contentTrack,
        {
          yPercent: finalTrackY,
          duration: transitionCount,
        },
        0,
      );

      for (let index = 0; index < slides.length - 1; index++) {
        const image = imageRefs.current[index];

        if (!image) continue;

        timeline.to(
          image,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            WebkitClipPath: "inset(0% 0% 100% 0%)",
            duration: 1,
            ease: "none",
          },
          index,
        );
      }
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[100svh]
        min-h-[620px]
        w-full
        overflow-hidden
        bg-[#080909]
        text-white
      "
    >
      <div
        className="
          relative
          grid
          h-full
          w-full
          grid-rows-[45%_55%]
          lg:grid-cols-2
          lg:grid-rows-1
        "
      >
        <div
          className="
            relative
            order-2
            h-full
            overflow-hidden
            bg-[#0b0c0c]
            lg:order-1
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
              opacity-[0.05]
            "
            style={{
              backgroundImage: `
                radial-gradient(
                  rgba(255,255,255,0.18) 0.7px,
                  transparent 0.7px
                )
              `,
              backgroundSize: "6px 6px",
            }}
          />

          <div
            ref={contentTrackRef}
            className="
              absolute
              left-0
              top-0
              z-10
              w-full
              will-change-transform
            "
            style={{
              height: `${slides.length * 100}%`,
            }}
          >
            {slides.map((slide) => (
              <article
                key={slide.id}
                className="
                  relative
                  flex
                  w-full
                  shrink-0
                  items-center
                "
                style={{
                  height: `${100 / slides.length}%`,
                }}
              >
                <div
                  className="
                    w-full
                    px-6
                    sm:px-10
                    md:px-14
                    lg:px-[9vw]
                    xl:px-[9.5vw]
                  "
                >
                  <p
                    className="
                      mb-4
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.32em]
                      text-white/45
                      md:mb-6
                      md:text-[10px]
                    "
                  >
                    {slide.eyebrow}
                  </p>

                  <h2
                    className="
                      font-serif
                      text-[clamp(2.8rem,12vw,4.8rem)]
                      font-normal
                      leading-[0.88]
                      tracking-[-0.045em]
                      text-white
                      lg:text-[clamp(4.5rem,6.3vw,8rem)]
                    "
                  >
                    {slide.title}
                  </h2>

                  <p
                    className="
                      mt-5
                      max-w-[560px]
                      text-[12px]
                      leading-[1.65]
                      text-white/60
                      sm:text-[13px]
                      lg:mt-8
                      lg:text-[15px]
                      lg:leading-[1.7]
                    "
                  >
                    {slide.description}
                  </p>

                  <a
                    href={slide.href}
                    className="
                      group
                      mt-6
                      inline-flex
                      h-[48px]
                      items-center
                      justify-center
                      border
                      border-white/20
                      px-6
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.25em]
                      text-white
                      transition-colors
                      duration-300
                      hover:border-white
                      hover:bg-white
                      hover:text-black
                      lg:mt-9
                      lg:h-[58px]
                      lg:px-8
                    "
                  >
                    {slide.button}

                    <span
                      className="
                        ml-5
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          className="
            relative
            order-1
            h-full
            overflow-hidden
            bg-black
            lg:order-2
          "
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              ref={(node) => {
                imageRefs.current[index] = node;
              }}
              className="
                absolute
                inset-0
                h-full
                w-full
                overflow-hidden
                will-change-[clip-path]
              "
              style={{
                zIndex: slides.length - index,
                clipPath: "inset(0% 0% 0% 0%)",
                WebkitClipPath: "inset(0% 0% 0% 0%)",
              }}
            >
              <img
                ref={(node) => {
                  imageInnerRefs.current[index] = node;
                }}
                src={slide.image}
                alt={slide.title}
                draggable={false}
                className="
                  pointer-events-none
                  h-full
                  w-full
                  select-none
                  object-cover
                  will-change-transform
                "
                style={{
                  objectPosition: slide.objectPosition ?? "center",
                  transformOrigin: "50% 50%",
                }}
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-black/5
                  via-transparent
                  to-black/15
                "
              />
            </div>
          ))}

          <div
            className="
              absolute
              bottom-5
              right-5
              z-50
              flex
              items-center
              gap-3
              md:bottom-7
              md:right-7
            "
          >
            <span
              className="
                text-[9px]
                tracking-[0.2em]
                text-white
              "
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </span>

            <span
              className="
                h-px
                w-8
                bg-white/40
              "
            />

            <span
              className="
                text-[9px]
                tracking-[0.2em]
                text-white/40
              "
            >
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <div
        className="
          pointer-events-none
          absolute
          bottom-3
          left-4
          right-4
          z-[100]
          h-px
          bg-white/15
          lg:bottom-5
          lg:left-5
          lg:right-5
        "
      >
        <div
          ref={progressRef}
          className="
            absolute
            inset-y-0
            left-0
            w-full
            origin-left
            scale-x-0
            bg-white/85
            will-change-transform
          "
        />
      </div>
    </section>
  );
}
