import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Visualizer: React.FC = () => {
  return (
    <Canvas>
      {/* 3D空間の基本設定 */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />

      {/* ジオメトリーのテスト描画 */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      {/* カメラ操作を可能にするコンポーネント */}
      <OrbitControls />
    </Canvas>
  );
};

export default Visualizer;
