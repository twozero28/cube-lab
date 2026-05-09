import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { CubieMesh } from "./cubie-mesh";
import { applyMove, createSolvedCube } from "../engine/cube";
import type { CubeState, Move } from "../engine/types";

const PREVIEW_SEQUENCE: Move[] = [
  { axis: "y", layer: 1, direction: 1 },
  { axis: "x", layer: -1, direction: -1 },
  { axis: "z", layer: 1, direction: 1 },
  { axis: "y", layer: -1, direction: -1 },
  { axis: "x", layer: 1, direction: 1 },
  { axis: "z", layer: -1, direction: -1 },
  { axis: "y", layer: 1, direction: -1 },
  { axis: "x", layer: -1, direction: 1 },
];

const MOVE_DURATION = 0.52;

export function LandingCubePreview() {
  return (
    <div className="landing-cube-canvas">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0.2, 0.62, 8.2], fov: 24 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={1.55} />
        <directionalLight position={[5, 7, 6]} intensity={2.25} color="#fff7e7" />
        <pointLight position={[-4, 3, 5]} intensity={0.75} color="#d8b99b" />
        <pointLight position={[4, -1, 4]} intensity={0.55} color="#8fa58b" />
        <ScrambleLoopCube />
      </Canvas>
    </div>
  );
}

function ScrambleLoopCube() {
  const [cube, setCube] = useState<CubeState>(() => createSolvedCube(3));
  const [activeMove, setActiveMove] = useState<Move>(PREVIEW_SEQUENCE[0]);

  const moveIndexRef = useRef(0);
  const progressRef = useRef(0);
  const floatRef = useRef<THREE.Group>(null);
  const animatedGroupRef = useRef<THREE.Group>(null);

  const animatedIds = useMemo(
    () =>
      new Set(
        cube.cubies
          .filter((cubie) => cubie.position[activeMove.axis] === activeMove.layer)
          .map((cubie) => cubie.id),
      ),
    [activeMove, cube.cubies],
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(time * 0.85) * 0.08;
      floatRef.current.rotation.y = Math.sin(time * 0.18) * 0.12;
    }

    progressRef.current += delta;
    const progress = Math.min(progressRef.current / MOVE_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const targetAngle = activeMove.direction * (Math.PI / 2);

    if (animatedGroupRef.current) {
      animatedGroupRef.current.rotation.set(0, 0, 0);
      const axisVector =
        activeMove.axis === "x"
          ? new THREE.Vector3(1, 0, 0)
          : activeMove.axis === "y"
            ? new THREE.Vector3(0, 1, 0)
            : new THREE.Vector3(0, 0, 1);
      animatedGroupRef.current.setRotationFromAxisAngle(axisVector, targetAngle * eased);
    }

    if (progress < 1) {
      return;
    }

    progressRef.current = 0;
    setCube((current) => applyMove(current, activeMove));
    moveIndexRef.current = (moveIndexRef.current + 1) % PREVIEW_SEQUENCE.length;
    setActiveMove(PREVIEW_SEQUENCE[moveIndexRef.current] ?? PREVIEW_SEQUENCE[0]);
  });

  return (
    <group ref={floatRef}>
      <group position={[0, -0.1, 0]} rotation={[-0.46, 0.72, 0.04]} scale={0.9}>
        <group>
          {cube.cubies
            .filter((cubie) => !animatedIds.has(cubie.id))
            .map((cubie) => (
              <CubieMesh
                key={cubie.id}
                cubie={cubie}
                size={3}
                highlighted={false}
                hoveredFace={null}
                onFacePointerDown={() => undefined}
                onFacePointerEnter={() => undefined}
                onFacePointerLeave={() => undefined}
              />
            ))}
        </group>

        <group ref={animatedGroupRef}>
          {cube.cubies
            .filter((cubie) => animatedIds.has(cubie.id))
            .map((cubie) => (
              <CubieMesh
                key={cubie.id}
                cubie={cubie}
                size={3}
                highlighted={false}
                hoveredFace={null}
                onFacePointerDown={() => undefined}
                onFacePointerEnter={() => undefined}
                onFacePointerLeave={() => undefined}
              />
            ))}
        </group>
      </group>
    </group>
  );
}
