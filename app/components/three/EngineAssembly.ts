import * as THREE from 'three';
import { calculateCrankKinematics } from '../../utils/apexLogic';
import { createBrushedMetalBumpTexture } from './webglUtils';

export interface EngineAssemblyRig {
  root: THREE.Group;
  crankshaftGroup: THREE.Group;
  gears: Array<{ mesh: THREE.Mesh; ratio: number }>;
  pistons: Array<{ group: THREE.Group; rod: THREE.Mesh; phaseOffset: number }>;
  oilParticles: THREE.InstancedMesh;
  oilCurve: THREE.CatmullRomCurve3;
  updateKinematics: (crankAngleRad: number, oilPhase: number, stageIndex: 0 | 1 | 2) => void;
  dispose: () => void;
}

function createGearShape(outerRadius: number, innerRadius: number, teeth: number): THREE.Shape {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.42;
    const a3 = a0 + step * 0.64;

    const rBase = outerRadius * 0.84;
    if (i === 0) {
      shape.moveTo(Math.cos(a0) * rBase, Math.sin(a0) * rBase);
    } else {
      shape.lineTo(Math.cos(a0) * rBase, Math.sin(a0) * rBase);
    }
    shape.lineTo(Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius);
    shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius);
    shape.lineTo(Math.cos(a3) * rBase, Math.sin(a3) * rBase);
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  return shape;
}

export function createEngineAssemblyRig(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): EngineAssemblyRig {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const bumpTex = createBrushedMetalBumpTexture(maxAnisotropy);
  textures.push(bumpTex);

  const root = new THREE.Group();

  // Shared PBR metallic & lubricant materials
  const blockMat = new THREE.MeshPhysicalMaterial({
    color: 0x262b35,
    roughness: 0.36,
    metalness: 0.86,
    bumpMap: bumpTex,
    bumpScale: 0.012,
    transparent: true,
    opacity: 0.72,
  });
  const forgedSteelMat = new THREE.MeshPhysicalMaterial({
    color: 0xd1d5db,
    roughness: 0.18,
    metalness: 0.95,
    anisotropy: 0.75,
    bumpMap: bumpTex,
    bumpScale: 0.008,
  });
  const crimsonAccentMat = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    roughness: 0.25,
    metalness: 0.82,
    clearcoat: 0.7,
  });
  const oilMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    emissive: 0xb45309,
    emissiveIntensity: 0.55,
    roughness: 0.1,
    metalness: 0.15,
    clearcoat: 1.0,
  });
  const oilTubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    emissive: 0x92400e,
    emissiveIntensity: 0.25,
    roughness: 0.18,
    metalness: 0.2,
    transparent: true,
    opacity: 0.36,
  });
  materials.push(blockMat, forgedSteelMat, crimsonAccentMat, oilMat, oilTubeMat);

  // 1. Cutaway Lower Crankcase & Cylinder Block Frame
  const basePlateGeo = new THREE.BoxGeometry(3.4, 0.28, 1.4);
  geometries.push(basePlateGeo);
  const basePlate = new THREE.Mesh(basePlateGeo, blockMat);
  basePlate.position.set(0, -1.25, 0);
  basePlate.receiveShadow = !isSoftwareGl;
  root.add(basePlate);

  // Cylinder sleeve housings (open front cutaway so pistons remain crystal clear)
  const sleeveGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.35, 24, 1, true, Math.PI * 0.75, Math.PI * 1.5);
  geometries.push(sleeveGeo);

  const cylinderXs = [-1.05, -0.35, 0.35, 1.05];
  const phaseOffsets = [0, Math.PI, Math.PI, 0];

  for (const cx of cylinderXs) {
    const sleeve = new THREE.Mesh(sleeveGeo, blockMat);
    sleeve.position.set(cx, 0.45, 0);
    root.add(sleeve);
  }

  // 2. Forged Steel Crankshaft + Crankpins
  const crankshaftGroup = new THREE.Group();
  crankshaftGroup.position.set(0, -0.82, 0);
  root.add(crankshaftGroup);

  const mainShaftGeo = new THREE.CylinderGeometry(0.11, 0.11, 3.2, 20);
  geometries.push(mainShaftGeo);
  const mainShaft = new THREE.Mesh(mainShaftGeo, forgedSteelMat);
  mainShaft.rotation.z = Math.PI / 2;
  crankshaftGroup.add(mainShaft);

  const webGeo = new THREE.BoxGeometry(0.08, 0.44, 0.28);
  geometries.push(webGeo);
  const pinGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.28, 16);
  geometries.push(pinGeo);

  const crankRadius = 0.26;
  const rodLength = 0.92;

  for (let i = 0; i < 4; i++) {
    const cx = cylinderXs[i];
    const dir = phaseOffsets[i] === 0 ? 1 : -1;

    const webL = new THREE.Mesh(webGeo, forgedSteelMat);
    webL.position.set(cx - 0.14, dir * 0.12, 0);
    crankshaftGroup.add(webL);

    const webR = new THREE.Mesh(webGeo, forgedSteelMat);
    webR.position.set(cx + 0.14, dir * 0.12, 0);
    crankshaftGroup.add(webR);

    const pin = new THREE.Mesh(pinGeo, crimsonAccentMat);
    pin.rotation.z = Math.PI / 2;
    pin.position.set(cx, dir * crankRadius, 0);
    crankshaftGroup.add(pin);
  }

  // 3. 4 Reciprocating Pistons & Connecting Rods
  const pistonHeadGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.32, 24);
  const pistonRingGeo = new THREE.TorusGeometry(0.265, 0.018, 10, 28);
  const rodGeo = new THREE.BoxGeometry(0.08, rodLength, 0.08);
  geometries.push(pistonHeadGeo, pistonRingGeo, rodGeo);

  const pistons: EngineAssemblyRig['pistons'] = [];

  for (let i = 0; i < 4; i++) {
    const cx = cylinderXs[i];
    const pGroup = new THREE.Group();
    pGroup.position.set(cx, 0.4, 0);

    const head = new THREE.Mesh(pistonHeadGeo, forgedSteelMat);
    head.castShadow = !isSoftwareGl;
    pGroup.add(head);

    const ring1 = new THREE.Mesh(pistonRingGeo, oilMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.09;
    pGroup.add(ring1);

    const ring2 = new THREE.Mesh(pistonRingGeo, crimsonAccentMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.03;
    pGroup.add(ring2);

    root.add(pGroup);

    const rod = new THREE.Mesh(rodGeo, forgedSteelMat);
    rod.position.set(cx, -0.2, 0);
    root.add(rod);

    pistons.push({ group: pGroup, rod, phaseOffset: phaseOffsets[i] });
  }

  // 4. Interlocking Precision Timing Gears
  const gearPrimaryGeo = new THREE.ExtrudeGeometry(createGearShape(0.48, 0.14, 16), {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  gearPrimaryGeo.center();

  const gearSecondaryGeo = new THREE.ExtrudeGeometry(createGearShape(0.32, 0.09, 12), {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  gearSecondaryGeo.center();
  geometries.push(gearPrimaryGeo, gearSecondaryGeo);

  const gear1 = new THREE.Mesh(gearPrimaryGeo, forgedSteelMat);
  gear1.position.set(-1.68, -0.82, 0);
  root.add(gear1);

  const gear2 = new THREE.Mesh(gearSecondaryGeo, crimsonAccentMat);
  gear2.position.set(-1.68, -0.04, 0);
  root.add(gear2);

  const gear3 = new THREE.Mesh(gearSecondaryGeo, forgedSteelMat);
  gear3.position.set(1.68, -0.82, 0);
  root.add(gear3);

  const gears = [
    { mesh: gear1, ratio: 1 },
    { mesh: gear2, ratio: -1.333 },
    { mesh: gear3, ratio: 1 },
  ];

  // 5. Cutaway Oil Gallery Tubing & Flowing Instanced Amber Lubricant Droplets
  const oilCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.65, -1.05, 0.36),
    new THREE.Vector3(-1.1, -0.55, 0.42),
    new THREE.Vector3(-0.35, 0.92, 0.36),
    new THREE.Vector3(0.35, 0.92, 0.36),
    new THREE.Vector3(1.1, -0.35, 0.42),
    new THREE.Vector3(1.65, -1.05, 0.36),
    new THREE.Vector3(0, -1.18, -0.34),
    new THREE.Vector3(-1.65, -1.05, 0.36),
  ], true);

  const tubeGeo = new THREE.TubeGeometry(oilCurve, 72, 0.045, 10, true);
  geometries.push(tubeGeo);
  const tubeMesh = new THREE.Mesh(tubeGeo, oilTubeMat);
  root.add(tubeMesh);

  const particleCount = 32;
  const particleGeo = new THREE.SphereGeometry(0.036, 10, 10);
  geometries.push(particleGeo);
  const oilParticles = new THREE.InstancedMesh(particleGeo, oilMat, particleCount);
  oilParticles.frustumCulled = false;
  root.add(oilParticles);

  const tempPos = new THREE.Vector3();
  const dummy = new THREE.Object3D();

  const updateKinematics = (
    crankAngleRad: number,
    oilPhase: number,
    stageIndex: 0 | 1 | 2,
  ) => {
    crankshaftGroup.rotation.x = crankAngleRad;

    for (const g of gears) {
      g.mesh.rotation.z = crankAngleRad * g.ratio;
    }

    for (let i = 0; i < pistons.length; i++) {
      const p = pistons[i];
      const theta = crankAngleRad + p.phaseOffset;
      const kin = calculateCrankKinematics(theta, crankRadius, rodLength);

      const pistonBaseY = 0.25;
      p.group.position.y = pistonBaseY + kin.pistonOffset;

      const pinY = -0.82 + Math.cos(theta) * crankRadius;
      const pinZ = Math.sin(theta) * crankRadius;
      const topY = p.group.position.y - 0.08;

      p.rod.position.set(p.group.position.x, (pinY + topY) * 0.5, pinZ * 0.5);
      p.rod.rotation.x = -Math.atan2(pinZ, topY - pinY);
    }

    // Update flowing lubricant particles along gallery circuit
    for (let i = 0; i < particleCount; i++) {
      const t = (oilPhase + i / particleCount) % 1;
      oilCurve.getPointAt(t, tempPos);
      dummy.position.copy(tempPos);
      const pulseScale = stageIndex === 1 ? 1.15 : 0.95;
      dummy.scale.setScalar(pulseScale);
      dummy.updateMatrix();
      oilParticles.setMatrixAt(i, dummy.matrix);
    }
    oilParticles.instanceMatrix.needsUpdate = true;

    // Highlight accent thermal/protection cue subtly without neon blowout
    oilMat.emissive.setHex(stageIndex === 1 ? 0xd97706 : stageIndex === 2 ? 0xdc2626 : 0xb45309);
  };

  updateKinematics(0, 0, 0);
  oilParticles.computeBoundingSphere();

  return {
    root,
    crankshaftGroup,
    gears,
    pistons,
    oilParticles,
    oilCurve,
    updateKinematics,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
