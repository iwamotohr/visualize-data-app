"use client";

import React, { useEffect, useRef, useState } from "react";
import FileUploader from "@/components/FileUploader";
import AudioPlayer from "@/components/AudioPlayer";
import Visualizer from "@/components/Visualizer";

const Home = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (audioRef.current && audioFile) {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const newAnalyser = audioContext.createAnalyser();
      newAnalyser.fftSize = 2048;

      source.connect(newAnalyser);
      newAnalyser.connect(audioContext.destination);

      setAnalyserNode(newAnalyser);
    }
  }, [audioFile]);

  const handleFileSelected = (file: File) => {
    setAudioFile(file);
  };

  return (
    <div className="relative min-h-screen">
      {/* ビジュアライザーコンポーネントを背景に配置 */}
      <div className="absolute inset-0 z-0">
        <Visualizer />
      </div>

      {/* UIを前面に配置 */}
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center p-24">
        <FileUploader onFileSelect={handleFileSelected} />

        {audioFile && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <AudioPlayer audioFile={audioFile} audioRef={audioRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
