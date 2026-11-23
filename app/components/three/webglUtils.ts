import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envTex = pmrem.fromScene(envScene, 0.04).texture;
  envScene.dispose();
  pmrem.dispose();
  return envTex;
}

export function createBrushedMetalBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#F4F4F4';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 1) {
    const shade = 112 + Math.floor(Math.sin(y * 0.45) * 18 + (Math.random() - 0.5) * 28);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 512, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.45, 'rgba(0, 0, 0, 0.34)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function createApexBottleLabelTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian metallic label field
  const bg = ctx.createLinearGradient(0, 0, 1024, 1024);
  bg.addColorStop(0, '#252B32');
  bg.addColorStop(0.55, '#252B32');
  bg.addColorStop(1, '#252B32');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle metallic micro-lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 1024; i += 24) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Apex Crimson structural diagonal accent band
  ctx.fillStyle = '#F28C28';
  ctx.beginPath();
  ctx.moveTo(0, 140);
  ctx.lineTo(1024, 90);
  ctx.lineTo(1024, 195);
  ctx.lineTo(0, 245);
  ctx.closePath();
  ctx.fill();

  // Warm gold oil highlight stripe
  const goldGrad = ctx.createLinearGradient(0, 250, 1024, 270);
  goldGrad.addColorStop(0, '#F28C28');
  goldGrad.addColorStop(0.5, '#F28C28');
  goldGrad.addColorStop(1, '#F28C28');
  ctx.fillStyle = goldGrad;
  ctx.fillRect(72, 268, 880, 10);

  // APEX wordmark
  ctx.fillStyle = '#F4F4F4';
  ctx.font = '800 128px "Barlow Condensed", sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('APEX', 72, 315);
  const apexWidth = ctx.measureText('APEX').width;

  ctx.fillStyle = '#F28C28';
  ctx.font = '700 50px "Barlow Condensed", sans-serif';
  ctx.fillText('LUBRICANTS', 72 + apexWidth + 24, 360);

  // Subtitle
  ctx.fillStyle = '#F4F4F4';
  ctx.font = '600 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SYNTHETICALLY ENGINEERED', 76, 480);

  // Grade plate
  ctx.fillStyle = '#252B32';
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 3;
  ctx.fillRect(76, 565, 872, 210);
  ctx.strokeRect(76, 565, 872, 210);

  ctx.fillStyle = '#F28C28';
  ctx.font = '800 108px "Barlow Condensed", sans-serif';
  ctx.fillText('5W-40', 110, 610);

  ctx.fillStyle = '#F4F4F4';
  ctx.font = '600 32px "JetBrains Mono", monospace';
  ctx.fillText('API SN / CF', 475, 622);
  ctx.fillStyle = '#F4F4F4';
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('FULLY SYNTHETIC MOTOR OIL', 475, 680);

  // Footer authentic UAE origin line
  ctx.fillStyle = '#F4F4F4';
  ctx.font = '500 26px "JetBrains Mono", monospace';
  ctx.fillText('BLENDED IN UAE  ·  ISO 9001:2015', 76, 860);

  ctx.fillStyle = '#F4F4F4';
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('4L / 1.05 US GAL', 76, 912);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function scheduleAfterDraw(
  renderer: THREE.WebGLRenderer,
  callback: () => void,
  registerTimer: (id: number) => void,
): void {
  const gl = renderer.getContext() as WebGL2RenderingContext;
  if (typeof gl.fenceSync === 'function') {
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
      if (state === gl.UNSIGNALED) {
        registerTimer(window.setTimeout(poll, 5));
      } else {
        if (sync) gl.deleteSync(sync);
        registerTimer(window.setTimeout(callback, 80));
      }
    };
    registerTimer(window.setTimeout(poll, 5));
  } else {
    registerTimer(window.setTimeout(callback, 80));
  }
}
