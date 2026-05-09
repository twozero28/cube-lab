import { useEffect, useRef, type ComponentRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { getCameraNudge, nudgeCameraFrame } from "../engine/controls";

import type { CameraNudgeCommand } from "../engine/types";

export function CameraRig({ enabled }: { enabled: boolean }) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const activeNudgesRef = useRef(new Set<CameraNudgeCommand>());
  const { camera } = useThree();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!enabled || isEditableTarget(event.target)) {
        return;
      }

      const nudge = getCameraNudge(event);

      if (!nudge) {
        return;
      }

      event.preventDefault();
      activeNudgesRef.current.add(nudge);
    }

    function handleKeyUp(event: KeyboardEvent) {
      const nudge = getCameraNudge(event);

      if (!nudge) {
        return;
      }

      activeNudgesRef.current.delete(nudge);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      activeNudgesRef.current.clear();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      activeNudgesRef.current.clear();
    }
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled || activeNudgesRef.current.size === 0) {
      return;
    }

    const controls = controlsRef.current;
    const target = controls?.target ?? new THREE.Vector3(0, 0, 0);
    const offset = camera.position.clone().sub(target);
    const nextFrame = nudgeCameraFrame({
      offset: toVec3(offset),
      up: toVec3(camera.up),
      nudges: activeNudgesRef.current,
      delta,
    });

    camera.up.set(nextFrame.up.x, nextFrame.up.y, nextFrame.up.z);
    camera.position
      .copy(target)
      .add(new THREE.Vector3(nextFrame.offset.x, nextFrame.offset.y, nextFrame.offset.z));
    camera.lookAt(target);
    camera.updateMatrixWorld();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.8}
    />
  );
}

function toVec3(vector: THREE.Vector3) {
  return {
    x: vector.x,
    y: vector.y,
    z: vector.z,
  };
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "SELECT" ||
    target.tagName === "TEXTAREA" ||
    target.closest('[role="dialog"]') !== null
  );
}
