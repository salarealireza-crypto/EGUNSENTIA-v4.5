import { useEffect, useRef } from "react";
import * as THREE from "three";

export type VizMode = "boot" | "radio" | "projector" | "vault" | "gate";

export function IndustrialViz({
  mode,
  accent = "#9dffb0",
  gateState = "normal",
  className,
}: {
  mode: VizMode;
  accent?: string;
  gateState?: "normal" | "combat" | "breach" | "destroyed";
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 1.15, 4.2);
    camera.lookAt(0, 0.4, 0);

    const iron = new THREE.MeshStandardMaterial({
      color: 0x2a2622,
      metalness: 0.72,
      roughness: 0.38,
    });
    const rust = new THREE.MeshStandardMaterial({
      color: 0x9c3d3a,
      metalness: 0.45,
      roughness: 0.55,
      emissive: 0x3a1210,
      emissiveIntensity: 0.25,
    });
    const lamp = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accent),
      emissive: new THREE.Color(accent),
      emissiveIntensity: 0.8,
      metalness: 0.2,
      roughness: 0.4,
    });

    scene.add(new THREE.AmbientLight(0x6a6258, 0.55));
    const key = new THREE.DirectionalLight(0xf0e6d6, 1.1);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.PointLight(new THREE.Color(accent), 1.4, 12);
    rim.position.set(-1.2, 1.4, 2);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);

    if (mode === "boot") {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.06, 10, 48), rust);
      ring.rotation.x = Math.PI / 2;
      root.add(ring);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.5, 8), iron);
      root.add(core);
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 4), rust);
      claw.position.set(0.55, 0.15, 0);
      claw.rotation.z = -0.7;
      root.add(claw);
      const claw2 = claw.clone();
      claw2.position.set(-0.55, 0.15, 0);
      claw2.rotation.z = 0.7;
      root.add(claw2);
      const plate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.4), iron);
      plate.position.y = -0.7;
      root.add(plate);
    } else if (mode === "radio") {
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 1.1), iron);
      root.add(body);
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 28), lamp);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0.55, 0.12, 0.58);
      root.add(dial);
      const grill = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.06), rust);
      grill.position.set(-0.5, 0.05, 0.56);
      root.add(grill);
    } else if (mode === "projector") {
      const housing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.1), iron);
      root.add(housing);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.5, 20), lamp);
      lens.rotation.z = Math.PI / 2;
      lens.position.set(1.05, 0.05, 0);
      root.add(lens);
      const reel = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.08, 8, 24), rust);
      reel.position.set(-0.2, 0.7, 0.2);
      reel.rotation.y = 0.4;
      root.add(reel);
      const beam = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 2.2, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xd7cbb8, transparent: true, opacity: 0.12, side: THREE.DoubleSide }),
      );
      beam.rotation.z = -Math.PI / 2;
      beam.position.set(2.1, 0.05, 0);
      root.add(beam);
    } else if (mode === "vault") {
      for (let i = 0; i < 3; i += 1) {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.7), i === 1 ? rust : iron);
        crate.position.set((i - 1) * 1.05, -0.15, 0);
        root.add(crate);
      }
      const bar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 0.08), lamp);
      bar.position.y = 0.55;
      root.add(bar);
    } else {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 0.35), iron);
      wall.position.z = -0.4;
      root.add(wall);
      const leafL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.12), rust);
      const leafR = leafL.clone();
      const open =
        gateState === "destroyed" ? 1.1 : gateState === "breach" ? 0.7 : gateState === "combat" ? 0.05 : 0.35;
      leafL.position.set(-0.45 - open, -0.05, 0.1);
      leafR.position.set(0.45 + open, -0.05, 0.1);
      root.add(leafL, leafR);
      if (gateState === "destroyed") {
        wall.rotation.z = 0.18;
        wall.position.y = -0.2;
      }
      const lampColor = gateState === "combat" || gateState === "breach" ? 0xff5a4e : 0x9dffb0;
      lamp.color.setHex(lampColor);
      lamp.emissive.setHex(lampColor);
      const sconce = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), lamp);
      sconce.position.set(0, 0.85, 0.1);
      root.add(sconce);
    }

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x141210, metalness: 0.2, roughness: 0.9 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.85;
    scene.add(floor);

    let frame = 0;
    let running = true;
    const resize = () => {
      const w = canvas.clientWidth || 320;
      const h = canvas.clientHeight || 140;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = () => {
      if (!running) return;
      frame += 1;
      const t = frame * 0.016;
      if (!reduced) {
        root.rotation.y = Math.sin(t * 0.35) * 0.25;
        if (mode === "boot") root.rotation.y = t * 0.35;
        if (mode === "radio") root.rotation.y = Math.sin(t * 0.5) * 0.15;
        rim.intensity = 1.1 + Math.sin(t * 2.2) * 0.25;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      ro.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
    };
  }, [mode, accent, gateState]);

  return <canvas ref={ref} className={className ?? "h-36 w-full"} aria-hidden />;
}
