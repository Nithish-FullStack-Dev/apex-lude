"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createEngineAssemblyRig } from "./EngineAssembly";
import {
  createStudioEnvironment,
  detectSoftwareWebGL,
  scheduleAfterDraw,
} from "./webglUtils";

interface EngineSceneProps {
  scrollProgress: number;
  stageIndex: 0 | 1 | 2;
  reducedMotion: boolean;
}

export function EngineScene({
  scrollProgress,
  stageIndex,
  reducedMotion,
}: EngineSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(scrollProgress);
  const stageRef = useRef<0 | 1 | 2>(stageIndex);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  progressRef.current = scrollProgress;
  stageRef.current = stageIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.shadowMap.enabled = !isSoftwareGl;

    const initialW = Math.max(container.clientWidth, 320);
    const initialH = Math.max(container.clientHeight, 320);
    renderer.setSize(initialW, initialH);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(
      38,
      initialW / initialH,
      0.1,
      40,
    );
    camera.position.set(2.4, 1.35, 5.2);
    camera.lookAt(0, -0.1, 0);

    const hemi = new THREE.HemisphereLight(0xe2e8f0, 0x171412, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.3);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdc2626, 1.3);
    rimLight.position.set(-4, 2, -4);
    scene.add(rimLight);

    const rig = createEngineAssemblyRig(
      renderer.capabilities.getMaxAnisotropy(),
      isSoftwareGl,
    );
    scene.add(rig.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let smoothProgress = progressRef.current;
    let crankAngle = 0;
    let oilPhase = 0;
    let isVisible = true;
    let rafId = 0;
    let timerId = 0;
    let contextLost = false;
    let disposed = false;

    const registerTimer = (id: number) => {
      timerId = id;
    };

    const onResize = () => {
      if (!container || disposed) return;
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reducedMotion) {
        renderer.render(scene, camera);
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };

    const onContextRestored = () => {
      contextLost = false;
      scheduleNext();
    };

    window.addEventListener("resize", onResize);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      onContextRestored,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const nextVisible = Boolean(entry?.isIntersecting);
        if (nextVisible && !isVisible) {
          isVisible = true;
          scheduleNext();
        } else {
          isVisible = nextVisible;
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    const clock = new THREE.Clock();

    const renderFrame = () => {
      if (disposed || contextLost || !isVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      smoothProgress = THREE.MathUtils.damp(
        smoothProgress,
        progressRef.current,
        6.5,
        delta,
      );

      const activeStage = stageRef.current;

      if (!reducedMotion) {
        const speedMultiplier =
          activeStage === 1 ? 3.2 : activeStage === 2 ? 2.4 : 2.1;
        crankAngle += delta * speedMultiplier;
        oilPhase = (oilPhase + delta * 0.22) % 1;
      }

      rig.updateKinematics(
        crankAngle + smoothProgress * Math.PI * 2,
        oilPhase,
        activeStage,
      );

      // Scroll-driven camera choreography across the 3 storytelling phases
      const targetCamX = THREE.MathUtils.lerp(2.5, -1.9, smoothProgress);
      const targetCamY = 1.35 - Math.sin(smoothProgress * Math.PI) * 0.45;
      const targetCamZ = 5.15 - smoothProgress * 0.65;

      camera.position.set(targetCamX, targetCamY, targetCamZ);
      camera.lookAt(0, -0.08, 0);

      rig.root.rotation.y = -0.25 + smoothProgress * 0.55;

      renderer.render(scene, camera);
      if (!reducedMotion) {
        scheduleNext();
      }
    };

    const scheduleNext = () => {
      if (disposed || !isVisible || contextLost || reducedMotion) return;
      if (isSoftwareGl) {
        scheduleAfterDraw(renderer, renderFrame, registerTimer);
      } else {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    renderer.render(scene, camera);
    if (!reducedMotion) {
      scheduleNext();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      rig.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  if (webglUnavailable) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-[var(--color-charcoal)] p-8 text-center">
        <div>
          <p className="font-display text-3xl font-bold text-white">
            INLINE-4 ENGINE CUTAWAY
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Active Hydrodynamic Oil Circuit · Stage 0{stageIndex + 1}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      data-testid="engine-3d-canvas"
      aria-label="Interactive 3D engine assembly and lubricant circulation visualization"
      className="h-full w-full select-none"
    />
  );
}
