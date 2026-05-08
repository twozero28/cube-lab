import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

import { CubieMesh } from "./cubie-mesh";
import { CameraRig } from "./camera-rig";
import { deriveMoveIntent } from "../engine/gesture";
import { useGameStore } from "../store/game-store";

import type { CubieState, Face, Move } from "../engine/types";

interface PointerSession {
  cubieId: string;
  face: Face;
  startX: number;
  startY: number;
}

export function CubeScene() {
  const cube = useGameStore((state) => state.cube);
  const size = useGameStore((state) => state.size);
  const phase = useGameStore((state) => state.phase);
  const activeMove = useGameStore((state) => state.activeMove);
  const settings = useGameStore((state) => state.settings);
  const previewMove = useGameStore((state) => state.previewMove);
  const hoveredFace = useGameStore((state) => state.hoveredFace);
  const completeActiveMove = useGameStore((state) => state.completeActiveMove);
  const queueMove = useGameStore((state) => state.queueMove);
  const setPreviewMove = useGameStore((state) => state.setPreviewMove);
  const setHoveredFace = useGameStore((state) => state.setHoveredFace);

  const pointerSessionRef = useRef<PointerSession | null>(null);

  const highlightedIds = useMemo(() => {
    const move = activeMove?.move ?? previewMove;

    if (!move) {
      return new Set<string>();
    }

    return new Set(
      cube.cubies
        .filter((cubie) => cubie.position[move.axis] === move.layer)
        .map((cubie) => cubie.id),
    );
  }, [activeMove?.move, cube.cubies, previewMove]);

  const cubeScale = size === 2 ? 1.18 : 0.98;

  useEffect(() => {
    if (!activeMove) {
      return;
    }

    const timeout = window.setTimeout(() => {
      completeActiveMove();

      if (navigator.vibrate && useGameStore.getState().settings.hapticsEnabled) {
        navigator.vibrate(12);
      }
    }, 170);

    return () => window.clearTimeout(timeout);
  }, [activeMove, completeActiveMove]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const session = pointerSessionRef.current;
      if (!session) return;

      const cubie = cube.cubies.find((entry) => entry.id === session.cubieId);
      if (!cubie) return;

      const deltaX = event.clientX - session.startX;
      const deltaY = event.clientY - session.startY;

      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < settings.dragThreshold) {
        setPreviewMove(null);
        return;
      }

      setPreviewMove(
        deriveMoveIntent({
          face: session.face,
          cubiePosition: cubie.position,
          deltaX,
          deltaY,
        }),
      );
    }

    function handlePointerUp() {
      const preview = useGameStore.getState().previewMove;
      if (preview) queueMove(preview);

      pointerSessionRef.current = null;
      setPreviewMove(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [cube.cubies, queueMove, setPreviewMove, settings.dragThreshold]);

  return (
    <div className="game-stage">
      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
        camera={{
          position: size === 2 ? [4.3, 3.5, 5.3] : [4.9, 4.0, 6.1],
          fov: size === 2 ? 31 : 35,
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#090d18"]} />
        <fog attach="fog" args={["#090d18", 10, 18]} />
        <ambientLight intensity={1.15} />
        <directionalLight
          castShadow
          position={[4, 7, 5]}
          intensity={1.8}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-6, -3, -4]} intensity={1.1} color="#7dd3fc" />
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.18}>
          <group rotation={[-0.28, 0.68, 0]} scale={cubeScale}>
            <AnimatedCube
              cubies={cube.cubies}
              size={size}
              activeMove={activeMove?.move ?? null}
              highlightedCubieIds={highlightedIds}
              hoveredFace={hoveredFace}
              onFacePointerDown={(event, cubie, face) => {
                if (phase === "scrambling" || phase === "animating" || phase === "solved") {
                  return;
                }

                event.stopPropagation();
                pointerSessionRef.current = {
                  cubieId: cubie.id,
                  face,
                  startX: event.clientX,
                  startY: event.clientY,
                };
              }}
              onFacePointerEnter={(cubieId, face) => setHoveredFace({ cubieId, face })}
              onFacePointerLeave={() => setHoveredFace(null)}
            />
          </group>
        </Float>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.35, 0]} receiveShadow>
          <circleGeometry args={[5.1, 64]} />
          <meshStandardMaterial color="#0f1728" transparent opacity={0.58} />
        </mesh>
        <CameraRig
          enabled={!pointerSessionRef.current && phase !== "animating" && phase !== "scrambling"}
        />
      </Canvas>
    </div>
  );
}

function AnimatedCube({
  cubies,
  size,
  activeMove,
  highlightedCubieIds,
  hoveredFace,
  onFacePointerDown,
  onFacePointerEnter,
  onFacePointerLeave,
}: {
  cubies: CubieState[];
  size: 2 | 3;
  activeMove: Move | null;
  highlightedCubieIds: Set<string>;
  hoveredFace: { cubieId: string; face: string } | null;
  onFacePointerDown: (event: ThreeEvent<PointerEvent>, cubie: CubieState, face: Face) => void;
  onFacePointerEnter: (cubieId: string, face: Face) => void;
  onFacePointerLeave: () => void;
}) {
  const animatedGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!activeMove || !animatedGroupRef.current) {
      return;
    }

    animatedGroupRef.current.rotation.set(0, 0, 0);

    const axisVector =
      activeMove.axis === "x"
        ? new THREE.Vector3(1, 0, 0)
        : activeMove.axis === "y"
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1);

    const targetAngle = activeMove.direction * (Math.PI / 2);
    const duration = 170;
    const start = performance.now();
    let frame = 0;

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      animatedGroupRef.current?.setRotationFromAxisAngle(axisVector, targetAngle * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      animatedGroupRef.current?.rotation.set(0, 0, 0);
    };
  }, [activeMove]);

  const animatedIds = new Set(
    activeMove
      ? cubies
          .filter((cubie) => cubie.position[activeMove.axis] === activeMove.layer)
          .map((cubie) => cubie.id)
      : [],
  );

  return (
    <>
      <group>
        {cubies
          .filter((cubie) => !animatedIds.has(cubie.id))
          .map((cubie) => (
            <CubieMesh
              key={cubie.id}
              cubie={cubie}
              size={size}
              highlighted={highlightedCubieIds.has(cubie.id)}
              hoveredFace={hoveredFace?.cubieId === cubie.id ? (hoveredFace.face as Face) : null}
              onFacePointerDown={(event, face) => onFacePointerDown(event, cubie, face)}
              onFacePointerEnter={(face) => onFacePointerEnter(cubie.id, face)}
              onFacePointerLeave={onFacePointerLeave}
            />
          ))}
      </group>
      <group ref={animatedGroupRef}>
        {cubies
          .filter((cubie) => animatedIds.has(cubie.id))
          .map((cubie) => (
            <CubieMesh
              key={cubie.id}
              cubie={cubie}
              size={size}
              highlighted={highlightedCubieIds.has(cubie.id)}
              hoveredFace={hoveredFace?.cubieId === cubie.id ? (hoveredFace.face as Face) : null}
              onFacePointerDown={(event, face) => onFacePointerDown(event, cubie, face)}
              onFacePointerEnter={(face) => onFacePointerEnter(cubie.id, face)}
              onFacePointerLeave={onFacePointerLeave}
            />
          ))}
      </group>
    </>
  );
}
