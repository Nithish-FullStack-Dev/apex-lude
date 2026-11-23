"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { createLubricantBottleRig } from "./LubricantBottle";
import {
  createStudioEnvironment,
  detectSoftwareWebGL,
  scheduleAfterDraw,
} from "./webglUtils";

interface HeroSceneProps {
  reducedMotion: boolean;
}

export function HeroScene({ reducedMotion }: HeroSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    const baseCamZ = initialW < 520 ? 7.2 : 6.1;
    const baseCamX = initialW < 520 ? 0.0 : 0.25;
    const camera = new THREE.PerspectiveCamera(
      36,
      initialW / initialH,
      0.1,
      40,
    );
    camera.position.set(baseCamX, 0.45, baseCamZ);
    camera.lookAt(0, 0.1, 0);

    // 3-point studio lighting + warm/cool contrast
    const hemi = new THREE.HemisphereLight(0xdbeafe, 0x1e1b18, 0.8);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff1db, 2.2);
    keyLight.position.set(4.5, 6.5, 5.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 3.5;
    keyLight.shadow.camera.bottom = -3.5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdc2626, 1.45);
    rimLight.position.set(-4.5, 2.2, -3.5);
    scene.add(rimLight);

    const amberFill = new THREE.PointLight(0xf59e0b, 1.2, 12, 2);
    amberFill.position.set(2.5, -1.2, 3.0);
    scene.add(amberFill);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xffffff, 3.2, 2.5, 4.5);
      softbox.position.set(-3.2, 2.0, 3.8);
      softbox.lookAt(0, 0.1, 0);
      scene.add(softbox);
    }

    const rig = createLubricantBottleRig(
      renderer.capabilities.getMaxAnisotropy(),
      isSoftwareGl,
    );
    rig.root.position.set(0, -0.05, 0);
    scene.add(rig.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Reusable scratch objects to prevent GC churn
    const dummy = new THREE.Object3D();
    let pointerX = 0;
    let pointerY = 0;
    let smoothPtrX = 0;
    let smoothPtrY = 0;
    let scrollFactor = 0;
    let smoothScroll = 0;
    let isVisible = true;
    let rafId = 0;
    let timerId = 0;
    let contextLost = false;
    let disposed = false;

    const registerTimer = (id: number) => {
      timerId = id;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onScroll = () => {
      const vh = window.innerHeight || 900;
      scrollFactor = Math.min(1, Math.max(0, window.scrollY / vh));
    };

    const onResize = () => {
      if (!container || disposed) return;
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 280);
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

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
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
      const elapsed = clock.getElapsedTime();

      smoothPtrX = THREE.MathUtils.damp(smoothPtrX, pointerX, 5.5, delta);
      smoothPtrY = THREE.MathUtils.damp(smoothPtrY, pointerY, 5.5, delta);
      smoothScroll = THREE.MathUtils.damp(
        smoothScroll,
        scrollFactor,
        6.0,
        delta,
      );

      if (!reducedMotion) {
        rig.bottleGroup.rotation.y =
          elapsed * 0.32 + smoothPtrX * 0.42 + smoothScroll * 1.1;
        rig.bottleGroup.rotation.x = smoothPtrY * 0.14 - smoothScroll * 0.18;
        rig.bottleGroup.rotation.z = -0.06 - smoothPtrX * 0.06;
        rig.bottleGroup.position.y = Math.sin(elapsed * 1.4) * 0.06;

        // Animate orbiting golden lubricant droplets
        const bases = rig.dropletBasePositions;
        for (let i = 0; i < bases.length; i++) {
          const b = bases[i];
          const orbit = elapsed * b.speed * 0.35;
          const cos = Math.cos(orbit);
          const sin = Math.sin(orbit);
          dummy.position.set(
            b.x * cos - b.z * sin,
            b.y + Math.sin(elapsed * 1.5 + b.phase) * 0.14,
            b.x * sin + b.z * cos,
          );
          dummy.scale.set(b.scale, b.scale * 1.32, b.scale);
          dummy.updateMatrix();
          rig.droplets.setMatrixAt(i, dummy.matrix);
        }
        rig.droplets.instanceMatrix.needsUpdate = true;
      }

      const scaleVal = 1 - smoothScroll * 0.14;
      rig.root.scale.setScalar(scaleVal);
      const currentBaseZ = container.clientWidth < 520 ? 7.2 : 6.1;
      const currentBaseX = container.clientWidth < 520 ? 0.0 : 0.25;
      camera.position.x = currentBaseX;
      camera.position.z = currentBaseZ - smoothScroll * 0.65;
      camera.position.y = 0.45 + smoothScroll * 0.25;
      camera.lookAt(0, 0.08, 0);

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

    // Initial render
    renderer.render(scene, camera);
    if (!reducedMotion) {
      scheduleNext();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
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
      <div
        data-testid="hero-3d-fallback"
        className="flex h-full w-full items-center justify-center rounded-2xl border border-[var(--color-light-grey)]/10 bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-charcoal)] to-[var(--color-charcoal)] p-8"
      >
        <div className="text-center">
          <div className="font-display text-5xl font-bold tracking-tight text-white">
            APEX 5W-40
          </div>
          <p className="mt-2 font-mono-tech text-xs tracking-wider text-[var(--color-industrial-orange)]">
            API SN · FULLY SYNTHETIC PROTECTION
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      data-testid="hero-3d-canvas"
      aria-label="Interactive 3D Apex Lubricants synthetic engine oil container"
      className="h-full w-full select-none"
    />
  );
}
