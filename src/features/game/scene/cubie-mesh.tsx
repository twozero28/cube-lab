import type { ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

import { getCubieDimension, getWorldPosition } from "../engine/cube";

import type { CubeSize, CubieState, Face } from "../engine/types";

const FACE_TRANSFORMS: Record<
  Face,
  {
    position: [number, number, number];
    rotation: [number, number, number];
  }
> = {
  F: { position: [0, 0, 1], rotation: [0, 0, 0] },
  B: { position: [0, 0, -1], rotation: [0, Math.PI, 0] },
  U: { position: [0, 1, 0], rotation: [-Math.PI / 2, 0, 0] },
  D: { position: [0, -1, 0], rotation: [Math.PI / 2, 0, 0] },
  R: { position: [1, 0, 0], rotation: [0, Math.PI / 2, 0] },
  L: { position: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0] },
};

export function CubieMesh({
  cubie,
  size,
  highlighted,
  hoveredFace,
  onFacePointerDown,
  onFacePointerEnter,
  onFacePointerLeave,
}: {
  cubie: CubieState;
  size: CubeSize;
  highlighted: boolean;
  hoveredFace: Face | null;
  onFacePointerDown: (event: ThreeEvent<PointerEvent>, face: Face) => void;
  onFacePointerEnter: (face: Face) => void;
  onFacePointerLeave: () => void;
}) {
  const dimension = getCubieDimension(size);
  const position = getWorldPosition(cubie.position, size);
  const bodyRadius = size === 2 ? 0.065 : 0.052;
  const stickerDepth = size === 2 ? 0.024 : 0.02;
  const stickerSize = dimension * 0.72;
  const stickerOffset = dimension / 2 + stickerDepth * 0.52;

  return (
    <group position={position}>
      <RoundedBox
        castShadow
        receiveShadow
        args={[dimension, dimension, dimension]}
        radius={bodyRadius}
        smoothness={4}
        bevelSegments={4}
        creaseAngle={0.45}
      >
        <meshStandardMaterial
          color={highlighted ? "#2f2b26" : "#171513"}
          metalness={0.04}
          roughness={0.36}
          envMapIntensity={0.45}
        />
      </RoundedBox>

      {Object.entries(cubie.stickers).map(([face, color]) => {
        if (!color) {
          return null;
        }

        const transform = FACE_TRANSFORMS[face as Face];

        return (
          <RoundedBox
            key={`${cubie.id}-${face}`}
            position={[
              transform.position[0] * stickerOffset,
              transform.position[1] * stickerOffset,
              transform.position[2] * stickerOffset,
            ]}
            rotation={transform.rotation}
            args={[stickerSize, stickerSize, stickerDepth]}
            radius={bodyRadius * 0.82}
            smoothness={4}
            bevelSegments={3}
            creaseAngle={0.38}
            castShadow
            onPointerDown={(event) => onFacePointerDown(event, face as Face)}
            onPointerEnter={(event) => {
              event.stopPropagation();
              onFacePointerEnter(face as Face);
            }}
            onPointerLeave={onFacePointerLeave}
          >
            <meshPhysicalMaterial
              color={color}
              clearcoat={0.75}
              clearcoatRoughness={hoveredFace === face ? 0.12 : 0.2}
              metalness={0.02}
              roughness={hoveredFace === face ? 0.18 : 0.26}
              envMapIntensity={0.8}
            />
          </RoundedBox>
        );
      })}

      {highlighted ? (
        <mesh scale={1.08}>
          <boxGeometry args={[dimension, dimension, dimension]} />
          <meshBasicMaterial color="#68845f" wireframe opacity={0.3} transparent />
        </mesh>
      ) : null}
    </group>
  );
}
