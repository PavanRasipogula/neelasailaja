import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

interface ThreeGardenCanvasProps {
  interactive?: boolean;
}

export default function ThreeGardenCanvas({ interactive = true }: ThreeGardenCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL to adapt frame pacing and shadow fidelity
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement("canvas");
        const gl = probeCanvas.getContext("webgl2") || probeCanvas.getContext("webgl");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : (gl as WebGLRenderingContext).RENDERER;
        const gpu = String((gl as WebGLRenderingContext).getParameter(param));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFFFDF8, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.5, 9);
    camera.lookAt(0, 1.2, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light (Warm soft gold sun)
    const keyLight = new THREE.DirectionalLight(0xFFE4D0, 2.4);
    keyLight.position.set(6, 10, 6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    // Fill Light (Soft blush rose)
    const fillLight = new THREE.HemisphereLight(0xF7DCE2, 0x783C50, 1.2);
    scene.add(fillLight);

    // Rim Light (Gold highlight)
    const rimLight = new THREE.DirectionalLight(0xD8B779, 1.0);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // ----------------------------------------------------
    // Handcrafted Procedural Felt Garden Elements
    // ----------------------------------------------------
    const gardenGroup = new THREE.Group();
    scene.add(gardenGroup);

    // 1. Soft Wool Grass Mound
    const groundGeo = new THREE.CylinderGeometry(8, 8.5, 0.6, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x98A987, // Sage wool green
      roughness: 0.9,
      metalness: 0.05,
      bumpScale: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.3;
    ground.receiveShadow = !isSoftwareGl;
    gardenGroup.add(ground);

    // 2. Procedural Felt Rose Petal Mesh Helper
    const createFeltRose = (colorHex: number, scale = 1): THREE.Group => {
      const rose = new THREE.Group();
      const petalMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.85,
        metalness: 0.05,
      });

      // Concentric spiraling petal layers
      const petalGeo = new THREE.SphereGeometry(0.25, 8, 8);
      petalGeo.scale(1.2, 0.4, 0.8);

      const layers = [
        { count: 3, radius: 0.12, rotY: 0.4 },
        { count: 5, radius: 0.28, rotY: 0.7 },
        { count: 7, radius: 0.45, rotY: 1.0 },
      ];

      layers.forEach(({ count, radius, rotY }) => {
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const petal = new THREE.Mesh(petalGeo, petalMat);
          petal.position.set(Math.cos(angle) * radius, 0.1 + radius * 0.2, Math.sin(angle) * radius);
          petal.rotation.set(rotY, -angle, 0.3);
          petal.castShadow = !isSoftwareGl;
          rose.add(petal);
        }
      });

      // Center bud
      const budGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const budMat = new THREE.MeshStandardMaterial({
        color: 0x783C50, // Deep burgundy center
        roughness: 0.9,
      });
      const bud = new THREE.Mesh(budGeo, budMat);
      bud.position.y = 0.2;
      rose.add(bud);

      // Wool calyx & stem
      const calyxGeo = new THREE.CylinderGeometry(0.12, 0.04, 0.2, 6);
      const calyxMat = new THREE.MeshStandardMaterial({ color: 0x5C6E50, roughness: 0.9 });
      const calyx = new THREE.Mesh(calyxGeo, calyxMat);
      calyx.position.y = -0.05;
      rose.add(calyx);

      rose.scale.setScalar(scale);
      return rose;
    };

    // Place needle-felted roses in small floral clusters
    const roseColors = [0xE8A6B5, 0xD99AAA, 0xF7DCE2, 0xDE5D7C, 0xD8B779];
    const rosePositions: [number, number, number, number][] = [
      [-3.2, 0.2, 0.8, 1.2],
      [-2.6, 0.1, 1.5, 0.9],
      [-3.5, 0.15, 2.0, 1.0],
      [3.2, 0.2, 0.8, 1.2],
      [2.7, 0.1, 1.6, 0.85],
      [3.6, 0.15, 1.9, 1.1],
      [-1.8, 0.05, 3.2, 0.75],
      [1.8, 0.05, 3.2, 0.75],
    ];

    rosePositions.forEach(([x, y, z, scale], idx) => {
      const rose = createFeltRose(roseColors[idx % roseColors.length], scale);
      rose.position.set(x, y, z);
      rose.rotation.y = idx * 1.1;
      gardenGroup.add(rose);
    });

    // 3. Floating Rose Petals (Instanced for silky performance)
    const PETAL_COUNT = 45;
    const petalShapeGeo = new THREE.SphereGeometry(0.14, 6, 6);
    petalShapeGeo.scale(1.2, 0.25, 0.8);
    const floatingPetalMat = new THREE.MeshStandardMaterial({
      color: 0xE8A6B5,
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const petalInstances = new THREE.InstancedMesh(petalShapeGeo, floatingPetalMat, PETAL_COUNT);
    petalInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(petalInstances);

    // Initial petal physics states
    const petalsData = Array.from({ length: PETAL_COUNT }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: Math.random() * 8 + 0.5,
      z: (Math.random() - 0.5) * 8 + 1,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      speedY: 0.008 + Math.random() * 0.015,
      speedRot: 0.01 + Math.random() * 0.02,
      driftOffset: Math.random() * 10,
    }));

    // 4. Glowing Fairy Lights
    const LIGHT_COUNT = 20;
    const fairyLightGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const fairyLightMat = new THREE.MeshBasicMaterial({
      color: 0xFFF0BD,
    });
    const fairyInstances = new THREE.InstancedMesh(fairyLightGeo, fairyLightMat, LIGHT_COUNT);
    scene.add(fairyInstances);

    const fairyData = Array.from({ length: LIGHT_COUNT }, (_, i) => ({
      x: -4.5 + (i / LIGHT_COUNT) * 9 + (Math.random() - 0.5) * 0.8,
      y: 1.5 + Math.sin((i / LIGHT_COUNT) * Math.PI) * 1.8 + (Math.random() - 0.5) * 0.4,
      z: -1 + Math.cos(i * 0.5) * 1.5,
      phase: Math.random() * Math.PI * 2,
    }));

    // 5. Delicate Needle-Felted Wool Butterfly
    const butterfly = new THREE.Group();
    const wingGeo = new THREE.PlaneGeometry(0.35, 0.45);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xF7DCE2,
      roughness: 0.85,
      side: THREE.DoubleSide,
    });

    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.x = -0.18;
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.x = 0.18;
    butterfly.add(leftWing);
    butterfly.add(rightWing);

    const bodyGeo = new THREE.CapsuleGeometry(0.05, 0.3, 4, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x783C50, roughness: 0.9 });
    const bBody = new THREE.Mesh(bodyGeo, bodyMat);
    butterfly.add(bBody);

    butterfly.position.set(-1.2, 2.2, 3);
    butterfly.scale.setScalar(0.9);
    scene.add(butterfly);

    // 6. Soft Wool Clouds
    const createWoolCloud = (scale = 1): THREE.Group => {
      const cloud = new THREE.Group();
      const fluffMat = new THREE.MeshStandardMaterial({
        color: 0xFFFDF8,
        roughness: 0.95,
        metalness: 0.0,
      });

      const puffs = [
        [0, 0, 0, 0.8],
        [0.6, 0.1, 0, 0.65],
        [-0.6, 0.05, 0, 0.6],
        [0.3, 0.3, 0.1, 0.55],
        [-0.3, 0.25, -0.1, 0.5],
      ];

      puffs.forEach(([cx, cy, cz, cr]) => {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(cr, 10, 10), fluffMat);
        puff.position.set(cx, cy, cz);
        cloud.add(puff);
      });

      cloud.scale.setScalar(scale);
      return cloud;
    };

    const cloud1 = createWoolCloud(1.2);
    cloud1.position.set(-4, 5, -3);
    scene.add(cloud1);

    const cloud2 = createWoolCloud(0.9);
    cloud2.position.set(4.5, 4.2, -4);
    scene.add(cloud2);

    // Interactive mouse parallax drift
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.45;
      mouse.targetY = y * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // ----------------------------------------------------
    // Animation Loop with Software-WebGL Guard & Zero GC
    // ----------------------------------------------------
    let frameId = 0;
    const startTime = performance.now();
    const tempMatrix = new THREE.Matrix4();
    const tempPosition = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    const tempScale = new THREE.Vector3(1, 1, 1);
    const tempEuler = new THREE.Euler();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (!sync) {
          frameId = window.setTimeout(cb, 60);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 70);
        }
      };
      frameId = window.setTimeout(poll, 6);
    }

    const animate = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth camera parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.position.x = mouse.x * 2;
      camera.position.y = 2.5 + mouse.y * 1.2;
      camera.lookAt(0, 1.2, 0);

      // Rotate whole garden very subtly
      gardenGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.08;

      // Animate floating petals
      for (let i = 0; i < PETAL_COUNT; i++) {
        const p = petalsData[i];
        p.y -= p.speedY;
        p.rotX += p.speedRot;
        p.rotZ += p.speedRot * 0.7;

        // Reset if beneath ground
        if (p.y < -0.2) {
          p.y = 8 + Math.random() * 2;
          p.x = (Math.random() - 0.5) * 14;
        }

        const swayX = p.x + Math.sin(elapsed * 1.5 + p.driftOffset) * 0.35;
        tempPosition.set(swayX, p.y, p.z);
        tempEuler.set(p.rotX, p.rotY, p.rotZ);
        tempQuaternion.setFromEuler(tempEuler);
        tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
        petalInstances.setMatrixAt(i, tempMatrix);
      }
      petalInstances.instanceMatrix.needsUpdate = true;

      // Animate twinkling fairy lights
      for (let i = 0; i < LIGHT_COUNT; i++) {
        const f = fairyData[i];
        const pulse = 0.8 + Math.sin(elapsed * 2.5 + f.phase) * 0.35;
        tempPosition.set(f.x, f.y + Math.sin(elapsed + f.phase) * 0.15, f.z);
        tempScale.set(pulse, pulse, pulse);
        tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
        fairyInstances.setMatrixAt(i, tempMatrix);
      }
      fairyInstances.instanceMatrix.needsUpdate = true;

      // Butterfly fluttering flight path & wing flapping
      const bTime = elapsed * 1.2;
      butterfly.position.x = Math.sin(bTime * 0.8) * 2.2;
      butterfly.position.y = 2.0 + Math.cos(bTime * 1.3) * 0.6;
      butterfly.position.z = 2.5 + Math.sin(bTime * 0.5) * 1.2;
      butterfly.rotation.y = Math.cos(bTime * 0.8) * 0.8 + Math.PI / 2;

      const wingFlap = Math.sin(elapsed * 16) * 0.8;
      leftWing.rotation.y = wingFlap;
      rightWing.rotation.y = -wingFlap;

      // Drift clouds
      cloud1.position.x = -4 + Math.sin(elapsed * 0.08) * 0.8;
      cloud2.position.x = 4.5 - Math.cos(elapsed * 0.06) * 0.8;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
