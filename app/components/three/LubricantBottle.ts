import * as THREE from 'three';
import {
  createApexBottleLabelTexture,
  createBrushedMetalBumpTexture,
  createContactShadowTexture,
} from './webglUtils';

export interface LubricantBottleRig {
  root: THREE.Group;
  bottleGroup: THREE.Group;
  droplets: THREE.InstancedMesh;
  dropletBasePositions: Array<{ x: number; y: number; z: number; speed: number; phase: number; scale: number }>;
  dispose: () => void;
}

export function createLubricantBottleRig(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): LubricantBottleRig {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const root = new THREE.Group();
  const bottleGroup = new THREE.Group();
  root.add(bottleGroup);

  const bumpTex = createBrushedMetalBumpTexture(maxAnisotropy);
  const labelTex = createApexBottleLabelTexture(maxAnisotropy);
  const shadowTex = createContactShadowTexture();
  textures.push(bumpTex, labelTex, shadowTex);

  // 1. Primary sculpted HDPE ergonomic container body (ExtrudeGeometry with smooth bevels)
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-0.82, -1.35);
  bodyShape.lineTo(0.82, -1.35);
  bodyShape.quadraticCurveTo(0.95, -1.35, 0.95, -1.18);
  bodyShape.lineTo(0.95, 0.55);
  bodyShape.quadraticCurveTo(0.94, 0.96, 0.48, 1.24);
  bodyShape.lineTo(0.24, 1.38);
  bodyShape.lineTo(-0.24, 1.38);
  bodyShape.quadraticCurveTo(-0.62, 1.22, -0.82, 0.88);
  bodyShape.quadraticCurveTo(-0.95, 0.65, -0.95, 0.38);
  bodyShape.lineTo(-0.95, -1.18);
  bodyShape.quadraticCurveTo(-0.95, -1.35, -0.82, -1.35);

  // Integrated ergonomic handle cutout hole
  const handleHole = new THREE.Path();
  handleHole.moveTo(-0.72, 0.05);
  handleHole.lineTo(-0.46, 0.05);
  handleHole.quadraticCurveTo(-0.4, 0.05, -0.4, 0.14);
  handleHole.lineTo(-0.4, 0.72);
  handleHole.quadraticCurveTo(-0.4, 0.84, -0.52, 0.92);
  handleHole.lineTo(-0.68, 0.82);
  handleHole.quadraticCurveTo(-0.74, 0.76, -0.74, 0.64);
  handleHole.lineTo(-0.74, 0.14);
  handleHole.quadraticCurveTo(-0.74, 0.05, -0.72, 0.05);
  bodyShape.holes.push(handleHole);

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    steps: 2,
    depth: 0.76,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.12,
    bevelSegments: 5,
    curveSegments: 24,
  });
  bodyGeo.center();
  geometries.push(bodyGeo);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x161920,
    roughness: 0.42,
    metalness: 0.18,
    clearcoat: 0.35,
    clearcoatRoughness: 0.28,
    bumpMap: bumpTex,
    bumpScale: 0.008,
  });
  materials.push(bodyMat);

  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.castShadow = !isSoftwareGl;
  bodyMesh.receiveShadow = !isSoftwareGl;
  bottleGroup.add(bodyMesh);

  // 2. Sculpted side grip ribs (right flank)
  const ribGeo = new THREE.BoxGeometry(0.12, 0.06, 0.56);
  geometries.push(ribGeo);
  const ribMat = new THREE.MeshStandardMaterial({
    color: 0x222731,
    roughness: 0.65,
    metalness: 0.12,
  });
  materials.push(ribMat);

  for (let i = 0; i < 6; i++) {
    const rib = new THREE.Mesh(ribGeo, ribMat);
    rib.position.set(1.03, -0.82 + i * 0.14, 0);
    bottleGroup.add(rib);
  }

  // 3. Threaded bottle neck collar (LatheGeometry)
  const neckPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.28, 0.0),
    new THREE.Vector2(0.28, 0.18),
    new THREE.Vector2(0.24, 0.22),
    new THREE.Vector2(0.24, 0.42),
    new THREE.Vector2(0.0, 0.42),
  ];
  const neckGeo = new THREE.LatheGeometry(neckPoints, 32);
  geometries.push(neckGeo);
  const neckMat = new THREE.MeshStandardMaterial({
    color: 0x0f1116,
    roughness: 0.35,
    metalness: 0.4,
  });
  materials.push(neckMat);
  const neckMesh = new THREE.Mesh(neckGeo, neckMat);
  neckMesh.position.set(0.02, 1.38, 0);
  bottleGroup.add(neckMesh);

  // 4. Tamper-evident crimson collar ring
  const ringGeo = new THREE.TorusGeometry(0.275, 0.035, 16, 36);
  geometries.push(ringGeo);
  const crimsonMetalMat = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    roughness: 0.22,
    metalness: 0.85,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  });
  materials.push(crimsonMetalMat);

  const ringMesh = new THREE.Mesh(ringGeo, crimsonMetalMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.set(0.02, 1.53, 0);
  bottleGroup.add(ringMesh);

  // 5. Brushed anodized metallic screw cap + knurled top crown
  const capGeo = new THREE.CylinderGeometry(0.29, 0.3, 0.32, 32);
  geometries.push(capGeo);
  const capMat = new THREE.MeshPhysicalMaterial({
    color: 0xcbd5e1,
    roughness: 0.2,
    metalness: 0.94,
    clearcoat: 0.45,
    bumpMap: bumpTex,
    bumpScale: 0.015,
  });
  materials.push(capMat);

  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.set(0.02, 1.72, 0);
  capMesh.castShadow = !isSoftwareGl;
  bottleGroup.add(capMesh);

  const capTopRingGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.05, 32);
  geometries.push(capTopRingGeo);
  const capTopRing = new THREE.Mesh(capTopRingGeo, crimsonMetalMat);
  capTopRing.position.set(0.02, 1.89, 0);
  bottleGroup.add(capTopRing);

  // 6. Front & Rear high-contrast product label plates
  const labelGeo = new THREE.PlaneGeometry(1.16, 1.52);
  geometries.push(labelGeo);
  const labelMat = new THREE.MeshPhysicalMaterial({
    map: labelTex,
    color: 0xffffff,
    roughness: 0.28,
    metalness: 0.15,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
  });
  materials.push(labelMat);

  const frontLabel = new THREE.Mesh(labelGeo, labelMat);
  frontLabel.position.set(0.24, -0.22, 0.545);
  bottleGroup.add(frontLabel);

  const backLabel = new THREE.Mesh(labelGeo, labelMat);
  backLabel.rotation.y = Math.PI;
  backLabel.position.set(0.24, -0.22, -0.545);
  bottleGroup.add(backLabel);

  // 7. Recessed amber oil sight-level gauge strip on side flank
  const sightGeo = new THREE.BoxGeometry(0.04, 1.32, 0.12);
  geometries.push(sightGeo);
  const oilSightMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    emissive: 0xb45309,
    emissiveIntensity: 0.45,
    roughness: 0.12,
    metalness: 0.1,
    clearcoat: 1.0,
  });
  materials.push(oilSightMat);

  const sightStrip = new THREE.Mesh(sightGeo, oilSightMat);
  sightStrip.position.set(1.06, -0.15, 0.28);
  bottleGroup.add(sightStrip);

  // Subtle floor reflection disc + grounded contact shadow
  const shadowGeo = new THREE.PlaneGeometry(3.4, 3.4);
  geometries.push(shadowGeo);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  materials.push(shadowMat);
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.set(0, -1.66, 0);
  root.add(shadowDisc);

  const floorRingGeo = new THREE.RingGeometry(1.38, 1.42, 64);
  geometries.push(floorRingGeo);
  const floorRingMat = new THREE.MeshBasicMaterial({
    color: 0xd97706,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
  });
  materials.push(floorRingMat);
  const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat);
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.set(0, -1.64, 0);
  root.add(floorRing);

  // Instanced orbiting golden-amber lubricant droplets (performant single draw call)
  const dropletCount = 18;
  const dropletGeo = new THREE.SphereGeometry(0.055, 16, 16);
  geometries.push(dropletGeo);
  const dropletMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    emissive: 0x78350f,
    emissiveIntensity: 0.35,
    roughness: 0.08,
    metalness: 0.15,
    clearcoat: 1.0,
  });
  materials.push(dropletMat);

  const droplets = new THREE.InstancedMesh(dropletGeo, dropletMat, dropletCount);
  droplets.frustumCulled = false;

  const dropletBasePositions: LubricantBottleRig['dropletBasePositions'] = [];
  const dummy = new THREE.Object3D();

  for (let i = 0; i < dropletCount; i++) {
    const angle = (i / dropletCount) * Math.PI * 2;
    const radius = 1.48 + (i % 3) * 0.28;
    const y = -0.95 + ((i * 0.37) % 2.4);
    const scale = 0.55 + (i % 4) * 0.28;
    const speed = 0.45 + (i % 5) * 0.12;
    const phase = i * 0.7;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    dropletBasePositions.push({ x, y, z, speed, phase, scale });

    dummy.position.set(x, y, z);
    dummy.scale.set(scale, scale * 1.28, scale);
    dummy.updateMatrix();
    droplets.setMatrixAt(i, dummy.matrix);
  }
  droplets.instanceMatrix.needsUpdate = true;
  droplets.computeBoundingSphere();
  root.add(droplets);

  return {
    root,
    bottleGroup,
    droplets,
    dropletBasePositions,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
