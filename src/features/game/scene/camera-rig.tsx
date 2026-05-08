import { OrbitControls } from "@react-three/drei";

export function CameraRig({ enabled }: { enabled: boolean }) {
  return (
    <OrbitControls
      enabled={enabled}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={(Math.PI / 4) * 3}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
      rotateSpeed={0.8}
    />
  );
}
