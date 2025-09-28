"use client";

import React, { Suspense, useLayoutEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import holographicVertexShader from "@/shaders/holographic/vertex.glsl";
import holographicFragmentShader from "@/shaders/holographic/fragment.glsl";

interface VisualizerProps {
  modelUrl: string | null;
  scaleFactor?: number;
  frequencyData: Uint8Array | null;
}

const Model: React.FC<
  Omit<VisualizerProps, "frequencyData"> & { frequencyData: Uint8Array | null }
> = ({ modelUrl, scaleFactor, frequencyData }) => {
  const modelRef = React.useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl || ""); // useGLTFはCanvasの内部（子）でのみ実行可能のため、Modelコンポーネントを分離

  // useMemoでマテリアルを一度だけ生成する
  const holographicMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: holographicVertexShader,
        fragmentShader: holographicFragmentShader,
        uniforms: {
          uTime: { value: 0.0 },
          uColor: { value: new THREE.Color("cyan") },
          uBassGlitch: { value: 0.0 },
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [] // 依存配列を空にすることで、初回レンダリング時のみ実行
  );

  // モデルの読み込み完了後、マテリアルを置き換えてから中央配置を実行
  useLayoutEffect(() => {
    if (scene && holographicMaterial) {
      // ★ 読み込んだモデルのマテリアルをすべて置き換える
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = holographicMaterial;
        }
      });

      // マテリアル適用後に中央配置を実行
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
    }
  }, [scene, holographicMaterial]);

  // useFrameフックで毎フレームのアニメーションを定義
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    // 共通処理: シェーダーのuTimeを更新
    holographicMaterial.uniforms.uTime.value = elapsedTime;

    if (frequencyData) {
      // 低音域のデータを抽出 (例: 最初の10個のデータ)
      const lowFrequencyData = frequencyData.slice(0, 10);

      // 低音域の平均値を計算
      const lowBassAverage =
        lowFrequencyData.reduce((sum, value) => sum + value, 0) /
        lowFrequencyData.length;

      // 低音の強さをグリッチ量に変換してシェーダーに渡す
      // 0-255の値を0.0-1.0に正規化
      const bassGlitchAmount = (lowBassAverage / 255.0) * 0.3;
      holographicMaterial.uniforms.uBassGlitch.value = bassGlitchAmount;
    } else {
      // 音楽データがない場合は低音グリッチを0にする
      holographicMaterial.uniforms.uBassGlitch.value = 0.0;
    }

    // 共通処理: モデルを回転させる
    if (modelRef.current) {
      modelRef.current.rotation.y = elapsedTime * 0.1;
    }
  });

  return (
    scene && (
      <primitive ref={modelRef} object={scene} scale={scaleFactor || 0.9} />
    )
  );
};

const Visualizer: React.FC<VisualizerProps> = ({
  modelUrl,
  scaleFactor,
  frequencyData,
}) => {
  return (
    <Canvas>
      {/* デフォルトのカメラ設定を上書き */}
      <PerspectiveCamera
        makeDefault // このカメラをメインカメラとして設定
        position={[0, 0, 3]} // カメラの位置を調整
        fov={60} // 視野角を60度に設定
      />
      {/* 3D空間の基本設定 */}
      <color attach="background" args={["#110425"]} />
      {/* Suspenseでモデルの読み込みを待機 */}
      <Suspense fallback={null}>
        <Model
          modelUrl={modelUrl}
          scaleFactor={scaleFactor}
          frequencyData={frequencyData}
        />
      </Suspense>
      {/* カメラ操作を可能にするコンポーネント */}
      <OrbitControls />
    </Canvas>
  );
};

export default Visualizer;
