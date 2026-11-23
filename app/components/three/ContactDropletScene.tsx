"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  createStudioEnvironment,
  detectSoftwareWebGL,
  scheduleAfterDraw,
} from "./webglUtils";

interface ContactDropletSceneProps {
  reducedMotion: boolean;
}

export function ContactDropletScene({
  reducedMotion,
}: ContactDropletSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

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
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );

    const w = Math.max(container.clientWidth, 240);
    const h = Math.max(container.clientHeight, 240);
    renderer.setSize(w, h);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 30);
    camera.position.set(0, 0.4, 4.6);
    camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight(0xf1f5f9, 0x1c1917, 0.85);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff3d6, 2.2);
    key.position.set(3, 5, 4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xdc2626, 1.4);
    rim.position.set(-4, -1, -3);
    scene.add(rim);

    // Sculpted liquid oil droplet via LatheGeometry
    const dropletPoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const y = -0.85 + t * 1.85;
      const r =
        t < 0.35
          ? Math.sin((t / 0.35) * (Math.PI / 2)) * 0.62
          : Math.pow(1 - (t - 0.35) / 0.65, 1.35) * 0.62;
      dropletPoints.push(new THREE.Vector2(Math.max(0.001, r), y));
    }
    const dropletGeo = new THREE.LatheGeometry(dropletPoints, 36);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });
    const droplet = new THREE.Mesh(dropletGeo, dropletMat);

    // Brushed titanium precision bearing ring orbiting the droplet
    const ringGeo = new THREE.TorusGeometry(1.12, 0.055, 18, 64);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xd1d5db,
      roughness: 0.18,
      metalness: 0.94,
    });
    const outerRing = new THREE.Mesh(ringGeo, ringMat);
    outerRing.rotation.x = Math.PI * 0.35;

    const crimsonRingGeo = new THREE.TorusGeometry(0.95, 0.025, 14, 48);
    const crimsonRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xdc2626,
      roughness: 0.25,
      metalness: 0.85,
    });
    const innerRing = new THREE.Mesh(crimsonRingGeo, crimsonRingMat);
    innerRing.rotation.y = Math.PI * 0.3;

    const group = new THREE.Group();
    group.add(droplet, outerRing, innerRing);
    scene.add(group);

    let isVisible = false;
    let rafId = 0;
    let timerId = 0;
    let disposed = false;

    const registerTimer = (id: number) => {
      timerId = id;
    };

    const onResize = () => {
      if (!container || disposed) return;
      const nw = Math.max(container.clientWidth, 240);
      const nh = Math.max(container.clientHeight, 240);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      if (reducedMotion) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    const observer = new IntersectionObserver(
      (entries) => {
        const nextVisible = Boolean(entries[0]?.isIntersecting);
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
      if (disposed || !isVisible) return;
      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        droplet.position.y = Math.sin(elapsed * 1.4) * 0.08;
        outerRing.rotation.z = elapsed * 0.35;
        innerRing.rotation.x = elapsed * 0.45;
      }
      renderer.render(scene, camera);
      if (!reducedMotion) {
        scheduleNext();
      }
    };

    const scheduleNext = () => {
      if (disposed || !isVisible || reducedMotion) return;
      if (isSoftwareGl) {
        scheduleAfterDraw(renderer, renderFrame, registerTimer);
      } else {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    renderer.render(scene, camera);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      dropletGeo.dispose();
      dropletMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      crimsonRingGeo.dispose();
      crimsonRingMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      data-testid="contact-3d-canvas"
      aria-label="3D sculpted lubricant droplet and precision bearing ring"
      className="h-full w-full select-none"
    />
  );
}
