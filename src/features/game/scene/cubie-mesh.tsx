import type { ThreeEvent } from "@react-three/fiber";

import { getCubieDimension, getWorldPosition } from "../engine/cube";

import type { CubeSize, CubieState, Face } from "../engine/types";

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

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dimension, dimension, dimension]} />
        <meshStandardMaterial
          color={highlighted ? "#3a332b" : "#24211d"}
          metalness={0.06}
          roughness={0.5}
        />
      </mesh>

      {Object.entries(cubie.stickers).map(([face, color]) => {
        if (!color) {
          return null;
        }

        const transform = FACE_TRANSFORMS[face as Face];

        return (
          <mesh
            key={`${cubie.id}-${face}`}
            position={transform.position}
            rotation={transform.rotation}
            onPointerDown={(event) => onFacePointerDown(event, face as Face)}
            onPointerEnter={(event) => {
              event.stopPropagation();
              onFacePointerEnter(face as Face);
            }}
            onPointerLeave={onFacePointerLeave}
          >
            <planeGeometry args={[dimension * 0.82, dimension * 0.82]} />
            <meshStandardMaterial
              color={color}
              emissive="#000000"
              emissiveIntensity={0}
              metalness={0.05}
              roughness={hoveredFace === face ? 0.2 : 0.32}
            />
          </mesh>
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
