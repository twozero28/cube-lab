import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { applyMove, createSolvedCube, getCubieDimension, getWorldPosition } from "../engine/cube";
import type { CubeState, CubieState, Face, Move } from "../engine/types";

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

const FACE_TRANSFORMS: Record<
  Face,
  {
    position: [number, number, number];
    rotation: [number, number, number];
  }
> = {
  F: { position: [0, 0, 0.501], rotation: [0, 0, 0] },
  B: { position: [0, 0, -0.501], rotation: [0, Math.PI, 0] },
  U: { position: [0, 0.501, 0], rotation: [-Math.PI / 2, 0, 0] },
  D: { position: [0, -0.501, 0], rotation: [Math.PI / 2, 0, 0] },
  R: { position: [0.501, 0, 0], rotation: [0, Math.PI / 2, 0] },
  L: { position: [-0.501, 0, 0], rotation: [0, -Math.PI / 2, 0] },
};

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
        <ambientLight intensity={1.35} />
        <directionalLight position={[5, 7, 6]} intensity={2.15} color="#f4f2ff" />
        <pointLight position={[-4, 3, 5]} intensity={1.45} color="#00eefc" />
        <pointLight position={[4, -1, 4]} intensity={1.05} color="#ff51fa" />
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
              <PreviewCubie key={cubie.id} cubie={cubie} />
            ))}
        </group>

        <group ref={animatedGroupRef}>
          {cube.cubies
            .filter((cubie) => animatedIds.has(cubie.id))
            .map((cubie) => (
              <PreviewCubie key={cubie.id} cubie={cubie} />
            ))}
        </group>
      </group>
    </group>
  );
}

function PreviewCubie({ cubie }: { cubie: CubieState }) {
  const dimension = getCubieDimension(3) * 0.9;
  const [x, y, z] = getWorldPosition(cubie.position, 3);

  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dimension, dimension, dimension]} />
        <meshStandardMaterial
          color="#303652"
          emissive="#0f1224"
          emissiveIntensity={0.18}
          metalness={0.2}
          roughness={0.34}
        />
      </mesh>

      {Object.entries(cubie.stickers).map(([face, color]) => {
        if (!color) {
          return null;
        }

        const transform = FACE_TRANSFORMS[face as Face];
        const facePosition = scalePosition(transform.position, dimension);

        return (
          <mesh key={`${cubie.id}-${face}`} position={facePosition} rotation={transform.rotation}>
            <planeGeometry args={[dimension * 0.82, dimension * 0.82]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.1}
              metalness={0.04}
              roughness={0.18}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function scalePosition(position: [number, number, number], dimension: number) {
  const offset = dimension / 2 + 0.008;
  return [
    Math.sign(position[0]) * offset,
    Math.sign(position[1]) * offset,
    Math.sign(position[2]) * offset,
  ] as const;
}
