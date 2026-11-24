"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import LiquidEther from "@/components/LiquidEther";

gsap.registerPlugin(ScrollTrigger);

const MODEL_PATH = "/assets/models/engine-oil.glb";
const MODEL_YAW = 0;

type Product = {
  category: string;
  name: string;
  description: string;
  model: string;
  specs: string[];
};

type PointerState = {
  x: number;
  y: number;
};

type IntroClock = {
  start: number | null;
};

type Variant = "sharp" | "soft";

type SceneRefs = {
  /** 0 → 1 : hero → first carousel item (the "line up" move) */
  leadRef: MutableRefObject<number>;
  /** 0 → products.length - 1 : which carousel item is in focus */
  cursorRef: MutableRefObject<number>;
  introClockRef: MutableRefObject<IntroClock>;
  pointerRef: MutableRefObject<PointerState>;
};

const products: Product[] = [
  {
    category: "ENGINE OIL",
    name: "Engine Oil",
    description:
      "Advanced lubrication engineered for cleaner performance, thermal stability and dependable protection across demanding driving conditions.",
    model: MODEL_PATH,
    specs: ["Engine protection", "Thermal stability", "Cleaner performance"],
  },
  {
    category: "DIESEL",
    name: "Diesel Engine Oil",
    description:
      "Heavy-duty protection designed for diesel engines operating under higher loads, longer journeys and demanding working conditions.",
    model: MODEL_PATH,
    specs: ["Heavy-duty performance", "Deposit control", "Extended protection"],
  },
  {
    category: "GEAR",
    name: "Gear Oil",
    description:
      "High-strength lubrication formulated to protect gears and transmission components against pressure, wear and demanding movement.",
    model: MODEL_PATH,
    specs: [
      "Extreme pressure protection",
      "Wear resistance",
      "Smooth movement",
    ],
  },
  {
    category: "HYDRAULIC",
    name: "Hydraulic Oil",
    description:
      "Reliable hydraulic performance with stable viscosity, strong anti-wear properties and dependable system protection.",
    model: MODEL_PATH,
    specs: ["Viscosity stability", "Anti-wear protection", "System efficiency"],
  },
  {
    category: "TRANSMISSION",
    name: "Transmission Oil",
    description:
      "Precision lubrication designed to maintain smoother shifting, temperature control and long-term transmission performance.",
    model: MODEL_PATH,
    specs: ["Smooth shifting", "Heat resistance", "Transmission protection"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Tunables                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The pinned section is split into INTERVALS steps:
 *   step 1        : hero  → first carousel item (bottles line up)
 *   steps 2..N    : carousel item i → item i + 1
 * One wheel swipe / touch swipe / key press moves exactly one step.
 */
const INTERVALS = products.length;

/** Seconds a single step takes (bottles move + content out → gap → content in). */
const STEP_DURATION = 1.3;
/** Extra pause after a step before the next one is accepted. */
const STEP_COOLDOWN = 0.25;
/** How far (px) the text panels travel while leaving / arriving. */
const PANEL_TRAVEL = 70;

/** Blur (px) applied to the bottles that are not in focus. */
const SOFT_BLUR_PX = 3.5;
/** Render scale of the blurred layer (lower = cheaper + softer). */
const SOFT_DPR = 0.75;

/** Bottle intro: seconds of delay per bottle (center first, then outwards). */
const INTRO_DELAYS = [0, 0.22, 0.22, 0.44, 0.44];
const INTRO_DURATION = 1.8;
const CAMERA_INTRO_DURATION = 2.8;
const CAMERA_Z = 8;
const CAMERA_Z_START = 10.4;

const CAMERA = {
  position: [0, 0.15, CAMERA_Z] as [number, number, number],
  fov: 38,
  near: 0.1,
  far: 100,
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smooth = (start: number, end: number, value: number) => {
  if (start === end) return value >= end ? 1 : 0;
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

const mix = (a: number, b: number, t: number) => THREE.MathUtils.lerp(a, b, t);

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeOutBack = (t: number, overshoot = 1.3) => {
  const c3 = overshoot + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
};

/* -------------------------------------------------------------------------- */
/*  3D                                                                        */
/* -------------------------------------------------------------------------- */

function OilModel({
  product,
  index,
  variant,
  leadRef,
  cursorRef,
  introClockRef,
  pointerRef,
}: SceneRefs & {
  product: Product;
  index: number;
  variant: Variant;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(product.model);
  const screenWidth = useThree((state) => state.size.width);

  // Damped values live here so the intro offsets can be added on top
  // without being smoothed away.
  const motion = useRef({
    ready: false,
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    rx: 0,
    ry: 0,
    opacity: 0,
    focus: 1,
  });

  const modelData = useMemo(() => {
    const cloned = scene.clone(true);
    const materials: THREE.Material[] = [];

    cloned.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (!mesh.isMesh) return;

      mesh.castShadow = variant === "sharp";
      mesh.receiveShadow = true;

      const original = mesh.material;

      if (Array.isArray(original)) {
        mesh.material = original.map((material) => {
          const clonedMaterial = material.clone();
          clonedMaterial.transparent = true;
          clonedMaterial.opacity = 0;
          materials.push(clonedMaterial);
          return clonedMaterial;
        });
      } else if (original) {
        const clonedMaterial = original.clone();
        clonedMaterial.transparent = true;
        clonedMaterial.opacity = 0;
        materials.push(clonedMaterial);
        mesh.material = clonedMaterial;
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    cloned.position.set(-center.x, -center.y, -center.z);

    const normalScale = size.y > 0 ? 2.65 / size.y : 1;

    return {
      object: cloned,
      materials,
      normalScale,
    };
  }, [scene, variant]);

  useEffect(() => {
    return () => {
      modelData.materials.forEach((material) => material.dispose());
    };
  }, [modelData]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const m = motion.current;
    const lead = leadRef.current;
    const cursor = cursorRef.current;
    const isMobile = screenWidth < 768;

    /* ------------------------------ intro clock ------------------------------ */

    const clock = introClockRef.current;
    if (clock.start === null) clock.start = performance.now();

    const seconds = (performance.now() - clock.start) / 1000;
    const introT = clamp01(
      (seconds - (INTRO_DELAYS[index] ?? 0.44)) / INTRO_DURATION,
    );

    /* ------------------------------- hero layout ------------------------------ */

    const heroXDesktop = [0, -1.55, 1.55, -2.75, 2.75];
    const heroXMobile = [0, -0.76, 0.76, -1.35, 1.35];

    const heroX = isMobile
      ? (heroXMobile[index] ?? (index - 2) * 0.5)
      : (heroXDesktop[index] ?? (index - 2) * 0.85);

    const heroY = isMobile ? -0.9 : -1.05;
    const heroZ = index === 0 ? 0.65 : index <= 2 ? 0.15 : -0.35;

    const heroScales = [1.13, 0.98, 0.98, 0.84, 0.84];
    const heroScale = (heroScales[index] ?? 0.8) * (isMobile ? 0.82 : 1);

    /* ------------------------------ queue ("line up") ------------------------------ */

    const queueX = isMobile ? index * 0.16 : index * 0.42;
    const queueY = (isMobile ? -0.85 : -0.72) + Math.min(index, 4) * 0.045;
    const queueZ = 0.5 - index * (isMobile ? 0.72 : 0.9);
    const queueScale = (isMobile ? 0.91 : 1.06) * Math.pow(0.89, index);

    const queueTransition = smooth(0.1, 0.7, lead);
    const carouselBlend = smooth(0.66, 1, lead);

    /* -------------------------------- carousel -------------------------------- */

    const relative = index - cursor;

    const baseScale = isMobile ? 1 : 1.18;
    const activeX = isMobile ? -0.62 : -2.25;
    const activeY = isMobile ? -0.72 : -0.6;

    let carouselX: number;
    let carouselY: number;
    let carouselZ: number;
    let carouselScale: number;
    let carouselOpacity: number;

    if (relative >= 0) {
      const firstQueueStep = Math.min(relative, 1);
      const deeperStep = Math.max(relative - 1, 0);

      carouselX =
        activeX +
        firstQueueStep * (isMobile ? 1.08 : 2.25) +
        deeperStep * (isMobile ? 0.24 : 0.55);

      carouselY = activeY + Math.min(relative, 4) * (isMobile ? 0.025 : 0.045);

      carouselZ =
        0.65 -
        firstQueueStep * (isMobile ? 1.25 : 1.5) -
        deeperStep * (isMobile ? 0.6 : 0.8);

      // current one is clearly the biggest, the rest step down
      carouselScale = baseScale * Math.pow(0.82, relative);

      // the rest are low opacity
      carouselOpacity = Math.max(0.1, Math.pow(0.4, relative));
    } else {
      const exited = Math.abs(relative);

      carouselX = activeX + relative * (isMobile ? 1.15 : 2.05);
      carouselY = activeY - Math.min(exited, 1) * 0.1;
      carouselZ = 0.65 - exited * 0.3;
      carouselScale = baseScale * (1 - Math.min(exited, 1) * 0.12);
      carouselOpacity = Math.max(0, 1 - exited * 1.7);
    }

    // 1 = perfectly in focus, 0 = fully soft (blurred layer)
    const carouselFocus = 1 - smooth(0.05, 0.75, Math.abs(relative));

    /* --------------------------------- targets --------------------------------- */

    let targetX = mix(heroX, queueX, queueTransition);
    let targetY = mix(heroY, queueY, queueTransition);
    let targetZ = mix(heroZ, queueZ, queueTransition);
    let targetScale = mix(heroScale, queueScale, queueTransition);

    targetX = mix(targetX, carouselX, carouselBlend);
    targetY = mix(targetY, carouselY, carouselBlend);
    targetZ = mix(targetZ, carouselZ, carouselBlend);
    targetScale = mix(targetScale, carouselScale, carouselBlend);

    const activeStrength =
      carouselBlend * clamp01(1 - Math.abs(relative) * 1.75);

    const pointerX = pointerRef.current.x;
    const pointerY = pointerRef.current.y;

    targetX += pointerX * 0.11 * activeStrength;
    targetY += pointerY * 0.045 * activeStrength;

    const heroRotation = index === 0 ? 0 : heroX < 0 ? 0.11 : -0.11;
    const queueRotation = index * 0.018;

    let rotationY = mix(heroRotation, queueRotation, queueTransition);
    rotationY = mix(rotationY, MODEL_YAW + relative * -0.025, carouselBlend);
    rotationY += pointerX * 0.13 * activeStrength;

    const rotationX = pointerY * 0.055 * activeStrength;

    targetY +=
      Math.sin(state.clock.elapsedTime * 1.15 + index * 0.65) *
      0.018 *
      activeStrength;

    /* ------------------------------ intro (one-off) ------------------------------ */
    // Bottles rise from below the screen, spin ~1.5 turns, fan out from the
    // centre, overshoot a little and settle. Center bottle first.

    const rise = 1 - easeOutBack(introT);
    const fan = 1 - easeOutCubic(introT);
    const spinSign = index % 2 === 0 ? 1 : -1;

    const introY = -3.6 * rise;
    const introX = -heroX * 0.9 * fan;
    const introSpin = spinSign * Math.PI * 3 * (1 - easeOutQuart(introT));
    const introTilt = -spinSign * 0.3 * fan;
    const introScale = 0.6 + 0.4 * easeOutCubic(introT);
    const introOpacity = smooth(0, 0.3, introT);

    /* --------------------------------- damping --------------------------------- */

    if (!m.ready) {
      m.x = targetX;
      m.y = targetY;
      m.z = targetZ;
      m.scale = targetScale;
      m.rx = rotationX;
      m.ry = rotationY;
      m.ready = true;
    } else {
      m.x = THREE.MathUtils.damp(m.x, targetX, 8, delta);
      m.y = THREE.MathUtils.damp(m.y, targetY, 8, delta);
      m.z = THREE.MathUtils.damp(m.z, targetZ, 8, delta);
      m.scale = THREE.MathUtils.damp(
        m.scale,
        Math.max(targetScale, 0.001),
        8,
        delta,
      );
      m.rx = THREE.MathUtils.damp(m.rx, rotationX, 7, delta);
      m.ry = THREE.MathUtils.damp(m.ry, rotationY, 7, delta);
    }

    group.position.set(m.x + introX, m.y + introY, m.z);
    group.scale.setScalar(Math.max(m.scale * introScale, 0.001));
    group.rotation.set(m.rx, m.ry + introSpin, introTilt);

    /* ---------------------- opacity + focus (sharp / soft) ---------------------- */

    const targetOpacity = introOpacity * mix(1, carouselOpacity, carouselBlend);
    const targetFocus = mix(1, carouselFocus, carouselBlend);

    m.opacity = THREE.MathUtils.damp(m.opacity, targetOpacity, 10, delta);
    m.focus = THREE.MathUtils.damp(m.focus, targetFocus, 8, delta);

    // The sharp layer shows the in-focus bottle, the blurred layer shows the rest.
    const weight =
      variant === "sharp" ? m.opacity * m.focus : m.opacity * (1 - m.focus);

    modelData.materials.forEach((material) => {
      material.opacity = weight;
      material.depthWrite = weight > 0.94;
    });
  });

  return (
    <group ref={groupRef} scale={0.001}>
      <group scale={modelData.normalScale}>
        <primitive object={modelData.object} dispose={null} />
      </group>
    </group>
  );
}

function ProductScene({
  variant,
  leadRef,
  cursorRef,
  introClockRef,
  pointerRef,
}: SceneRefs & { variant: Variant }) {
  const camera = useThree((state) => state.camera);

  // Slow dolly-in that plays together with the bottle intro.
  useFrame(() => {
    const clock = introClockRef.current;

    if (clock.start === null) {
      camera.position.z = CAMERA_Z_START;
      return;
    }

    const seconds = (performance.now() - clock.start) / 1000;
    const t = clamp01(seconds / CAMERA_INTRO_DURATION);

    camera.position.z =
      t >= 1 ? CAMERA_Z : mix(CAMERA_Z_START, CAMERA_Z, easeOutCubic(t));
  });

  return (
    <>
      <ambientLight intensity={1.25} />

      <directionalLight position={[4, 7, 6]} intensity={4.2} />

      <directionalLight position={[-5, 1, 4]} intensity={2} />

      <spotLight
        position={[0, 7, 3]}
        intensity={5}
        angle={0.45}
        penumbra={0.8}
      />

      <pointLight position={[0, -1, 5]} intensity={1.2} />

      {products.map((product, index) => (
        <OilModel
          key={`${variant}-${product.name}-${index}`}
          product={product}
          index={index}
          variant={variant}
          leadRef={leadRef}
          cursorRef={cursorRef}
          introClockRef={introClockRef}
          pointerRef={pointerRef}
        />
      ))}

      {variant === "sharp" && (
        <ContactShadows
          position={[0, -2.22, 0]}
          scale={10}
          opacity={0.32}
          blur={2.8}
          far={5}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function LubricantHeroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const leadRef = useRef(0);
  const cursorRef = useRef(0);
  const introClockRef = useRef<IntroClock>({ start: null });

  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
  });

  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ---------------------------- pointer parallax ---------------------------- */

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleBlur = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  /* ------------------------ title: always fits the screen ------------------------ */

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = "100px";
      const natural = el.offsetWidth;
      if (!natural) return;

      const available = document.documentElement.clientWidth * 0.92;
      el.style.fontSize = `${Math.min((100 * available) / natural, 216)}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);

    return () => window.removeEventListener("resize", fit);
  }, []);

  /* ------------------ pinned, step-locked scroll experience ------------------ */

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* ---- scroll position -> visuals ---- */

    const render = (progress: number) => {
      const pos = clamp01(progress) * INTERVALS; // 0 … INTERVALS
      const lead = clamp01(pos); // hero → first item
      const cursor = Math.max(0, pos - 1); // carousel item in focus

      leadRef.current = lead;
      cursorRef.current = cursor;

      const heroExit = smooth(0.02, 0.42, lead);
      const hintExit = smooth(0, 0.25, lead);

      if (heroCopyRef.current) {
        gsap.set(heroCopyRef.current, {
          yPercent: -34 * heroExit,
          opacity: 1 - heroExit,
          scale: 1 - heroExit * 0.045,
          filter: `blur(${heroExit * 10}px)`,
        });
      }

      if (scrollHintRef.current) {
        gsap.set(scrollHintRef.current, {
          opacity: 1 - hintExit,
          y: hintExit * 20,
        });
      }

      // The first panel waits until the hero text is gone.
      const reveal = smooth(0.62, 0.97, lead);

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;

        const local = cursor - index; // > 0 : leaving, <= 0 : arriving / current

        let visibility: number;
        let direction: 1 | -1;

        if (local > 0) {
          // old content leaves first …
          visibility = local >= 1 ? 0 : 1 - smooth(0, 0.3, local);
          direction = -1;
        } else {
          // … then there is a short empty gap, then new content arrives
          // and stays fully visible for the rest of the step.
          const arriving = 1 + local;
          visibility = arriving <= 0 ? 0 : smooth(0.62, 0.97, arriving);
          direction = 1;
        }

        visibility *= reveal;

        const hidden = 1 - visibility;

        gsap.set(panel, {
          opacity: visibility,
          y: direction * hidden * PANEL_TRAVEL,
          x: hidden * 22,
          scale: 0.965 + visibility * 0.035,
          filter: `blur(${hidden * 12}px)`,
          visibility: visibility < 0.005 ? "hidden" : "visible",
          pointerEvents: visibility > 0.75 ? "auto" : "none",
        });
      });
    };

    /* ---- step controller state ---- */

    let st!: ScrollTrigger;
    let locked = false;
    let targetStop = 0;
    let scrollTween: gsap.core.Tween | null = null;
    let unlockCall: gsap.core.Tween | null = null;
    let settleTimer: number | undefined;
    const proxy = { y: 0 };

    const progressNow = () => {
      const span = st.end - st.start;
      return span > 0 ? clamp01((window.scrollY - st.start) / span) : 0;
    };

    const stopY = (stop: number) =>
      st.start + ((st.end - st.start) * stop) / INTERVALS;

    const inRange = () =>
      window.scrollY >= st.start - 2 && window.scrollY <= st.end + 2;

    const stopNow = () =>
      locked ? targetStop : Math.round(progressNow() * INTERVALS);

    const jump = (y: number) => {
      window.scrollTo({
        top: y,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
      ScrollTrigger.update();
    };

    const goTo = (stop: number) => {
      const target = Math.min(INTERVALS, Math.max(0, stop));
      const targetY = stopY(target);
      const stepSpan = Math.max((st.end - st.start) / INTERVALS, 1);
      const distance = Math.abs(targetY - window.scrollY);

      // full step = STEP_DURATION, small nudges are quicker
      const duration = Math.max(
        0.35,
        STEP_DURATION * Math.min(1, distance / stepSpan),
      );

      scrollTween?.kill();
      unlockCall?.kill();
      window.clearTimeout(settleTimer);

      locked = true;
      targetStop = target;
      proxy.y = window.scrollY;

      scrollTween = gsap.to(proxy, {
        y: targetY,
        duration,
        ease: "power2.inOut",
        onUpdate: () => jump(proxy.y),
        onComplete: () => {
          jump(targetY);
          unlockCall = gsap.delayedCall(STEP_COOLDOWN, () => {
            locked = false;
          });
        },
      });
    };

    // If the person drags the scrollbar etc. and stops between two steps,
    // glide to the nearest one so a half-finished state never stays on screen.
    const settle = () => {
      if (locked || !inRange()) return;

      const pos = progressNow() * INTERVALS;
      const nearest = Math.round(pos);

      if (Math.abs(pos - nearest) > 0.004) goTo(nearest);
    };

    const scheduleSettle = () => {
      if (locked) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 180);
    };

    /**
     * "acted"   -> we started a step (swallow the native event)
     * "swallow" -> busy / tail of the previous gesture (swallow the native event)
     * "release" -> already at the first / last step: let the page scroll on
     */
    const handleIntent = (
      dir: 1 | -1,
      canAct: boolean,
    ): "acted" | "swallow" | "release" => {
      if (locked || !canAct) return "swallow";

      const stop = stopNow();
      const atEdge = (dir > 0 && stop >= INTERVALS) || (dir < 0 && stop <= 0);

      if (atEdge) return "release";

      goTo(stop + dir);
      return "acted";
    };

    /* ---- the pin itself ---- */

    st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * INTERVALS}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onUpdate: (self) => {
        render(self.progress);
        scheduleSettle();
      },

      onRefresh: (self) => render(self.progress),
    });

    render(st.progress);

    /* ---- input: wheel / trackpad ---- */

    let lastWheelAt = 0;
    let lastAbs = 0;
    let accumulated = 0;
    let consumed = false;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // pinch zoom

      const now = performance.now();
      const abs =
        Math.abs(event.deltaY) *
        (event.deltaMode === 1
          ? 32
          : event.deltaMode === 2
            ? window.innerHeight
            : 1);

      // A new gesture = a pause, a sudden stronger swipe, or a fresh mouse notch.
      // Trackpad inertia (decaying deltas) never counts as new.
      const newGesture =
        now - lastWheelAt > 90 ||
        abs > lastAbs * 1.6 + 8 ||
        (abs >= 90 && abs >= lastAbs);

      lastWheelAt = now;
      lastAbs = abs;

      if (newGesture) {
        consumed = false;
        accumulated = 0;
      }

      accumulated += abs;

      if (!inRange()) {
        // a gesture that is still running when we arrive must not skip steps
        consumed = true;
        return;
      }

      if (event.deltaY === 0) return;

      const dir = event.deltaY > 0 ? 1 : -1;
      const result = handleIntent(dir, !consumed && accumulated >= 18);

      if (result === "release") return;

      if (event.cancelable) event.preventDefault();
      if (result === "acted") consumed = true;
    };

    /* ---- input: touch ---- */

    let touchStartY = 0;
    let touchMode: "idle" | "ours" | "native" = "idle";
    let touchActed = false;

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchMode = "idle";
      touchActed = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchMode === "native" || !inRange()) return;

      const dy = touchStartY - (event.touches[0]?.clientY ?? touchStartY);

      if (touchMode === "idle") {
        if (dy === 0) return;

        const dir = dy > 0 ? 1 : -1;
        const stop = stopNow();
        const atEdge = (dir > 0 && stop >= INTERVALS) || (dir < 0 && stop <= 0);

        if (atEdge && !locked) {
          touchMode = "native";
          return;
        }

        touchMode = "ours";
      }

      if (event.cancelable) event.preventDefault();

      if (!touchActed && Math.abs(dy) > 40) {
        touchActed = true;
        handleIntent(dy > 0 ? 1 : -1, true);
      }
    };

    /* ---- input: keyboard ---- */

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      if (!inRange()) return;

      const target = event.target as HTMLElement | null;

      if (
        target &&
        (target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return;
      }

      let dir: 1 | -1 | 0 = 0;

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey)
      ) {
        dir = 1;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        dir = -1;
      }

      if (!dir) return;

      // space on a focused button should still press it
      if (event.key === " " && target?.tagName === "BUTTON") return;

      const result = handleIntent(dir, true);

      if (result !== "release") event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    /* ---- title reveal (plays with the bottle intro) ---- */

    const titleTween = titleRef.current
      ? gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 60, filter: "blur(18px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.5,
            delay: 0.25,
            ease: "power3.out",
            clearProps: "opacity,filter,transform",
          },
        )
      : null;

    const refresh = () => ScrollTrigger.refresh();

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    } else {
      refresh();
    }

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);

      window.clearTimeout(settleTimer);
      scrollTween?.kill();
      unlockCall?.kill();
      titleTween?.kill();

      st.kill(true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B497CF"]}
          mouseForce={20}
          cursorSize={100}
          persistence={0.75}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          intensity={1}
          viscosity={0}
          resolution={0.5}
          clickBurst
          bounceEdges={false}
          intro
          lightMode={false}
        />
      </div>

      <div
        ref={heroCopyRef}
        className="pointer-events-none absolute left-0 top-[17%] z-20 flex w-full justify-center px-3 sm:top-[16%] sm:px-6"
      >
        <div
          ref={titleRef}
          className="inline-block whitespace-nowrap text-center font-normal uppercase leading-[0.78] tracking-[-0.075em] font-sans"
          style={{
            fontSize: "clamp(2.1rem, 8.2vw, 13.1rem)",
          }}
        >
          POWER EVERY
          <br className="sm:hidden" />
          <span className="text-(--color-industrial-orange)"> MOVE </span>
        </div>
      </div>

      {/* Blurred layer: bottles that are not in focus */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[9]"
        style={{ filter: `blur(${SOFT_BLUR_PX}px)` }}
      >
        <Canvas
          dpr={SOFT_DPR}
          camera={CAMERA}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
          style={{
            background: "transparent",
          }}
        >
          <Suspense fallback={null}>
            <ProductScene
              variant="soft"
              leadRef={leadRef}
              cursorRef={cursorRef}
              introClockRef={introClockRef}
              pointerRef={pointerRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Sharp layer: hero bottles + the bottle in focus */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <Canvas
          dpr={[1, 1.6]}
          camera={CAMERA}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          style={{
            background: "transparent",
          }}
        >
          <Suspense fallback={null}>
            <ProductScene
              variant="sharp"
              leadRef={leadRef}
              cursorRef={cursorRef}
              introClockRef={introClockRef}
              pointerRef={pointerRef}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        {products.map((product, index) => (
          <div
            key={`content-${product.name}`}
            ref={(element) => {
              panelRefs.current[index] = element;
            }}
            className="absolute left-5 right-5 top-[59%] max-w-[520px] opacity-0 sm:left-auto sm:right-[7vw] sm:top-1/2 sm:w-[38vw] sm:-translate-y-1/2 lg:right-[9vw] lg:w-[34vw]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-white" />

              <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-white sm:text-xs">
                {String(index + 1).padStart(2, "0")} / {product.category}
              </span>
            </div>

            <h2 className="max-w-[600px] text-[clamp(2.4rem,5vw,5.7rem)] font-medium leading-[0.92] tracking-[-0.055em] text-(--color-industrial-orange)">
              {product.name}
            </h2>

            <p className="mt-5 max-w-[510px] text-sm leading-6 text-white/65 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {product.specs.map((spec) => (
                <span
                  key={spec}
                  className="rounded-full border border-white/15 bg-white/[0.055] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-white/75 backdrop-blur-md sm:text-xs"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="mt-7 h-[2px] w-full max-w-[380px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#FF9FFC] to-[#B497CF]"
                style={{
                  width: `${((index + 1) / products.length) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        ref={scrollHintRef}
        className="pointer-events-none absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/45 sm:bottom-9 sm:text-[10px]"
      >
        <span>Scroll to explore</span>

        <div className="relative h-9 w-px overflow-hidden bg-white/15">
          <div className="absolute left-0 top-0 h-4 w-px animate-[scrollLine_1.6s_ease-in-out_infinite] bg-white/70" />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% {
            transform: translateY(-130%);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(260%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

Array.from(new Set(products.map((product) => product.model))).forEach((path) =>
  useGLTF.preload(path),
);
