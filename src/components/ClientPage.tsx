"use client";

import React, { useEffect, useRef, useState } from "react";
import FileUploader from "@/components/FileUploader";
import AudioPlayer from "@/components/AudioPlayer";
import Visualizer from "@/components/Visualizer";
import PresetSelector from "@/components/PresetSelector";

// todo: getVisualizerPresetsの型定義
interface Preset {
  id: string;
  title: string;
  modelUrl: string;
  scaleFactor?: number;
}

interface ClientPageProps {
  presets: Preset[];
}

const ClientPage: React.FC<ClientPageProps> = ({ presets }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null); // AudioContextはRefのままでOK
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(
    presets[0] || null
  );

  // デフォルトの音楽ファイルを読み込む
  useEffect(() => {
    const fetchDefaultAudio = async () => {
      try {
        // publicディレクトリからの相対パスでファイルをfetch
        const response = await fetch("/flog_chorus.mp3");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const defaultFile = new File([blob], "flog_chorus.mp3", {
          type: "audio/mpeg",
        });
        setAudioFile(defaultFile);
      } catch (error) {
        console.error("Failed to load default audio file:", error);
      }
    };
    fetchDefaultAudio();
  }, []); // コンポーネントのマウント時に一度だけ実行

  // 再生時にAudioContextを初期化・再開し、AnalyserNodeをセットアップ
  const handlePlay = () => {
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      audioContextRef.current.resume();
    }

    if (audioRef.current && !analyserNode) {
      try {
        const context = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const source = context.createMediaElementSource(audioRef.current);
        const newAnalyser = context.createAnalyser();
        newAnalyser.fftSize = 2048;

        source.connect(newAnalyser);
        newAnalyser.connect(context.destination);

        audioContextRef.current = context;
        setAnalyserNode(newAnalyser);
      } catch (e) {
        console.error("Error initializing AudioContext:", e);
      }
    }
  };

  // AnalyserNodeからリアルタイムの周波数データを取得して状態を更新
  useEffect(() => {
    if (!analyserNode) return;

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    let animationId: number;
    const animate = () => {
      // リアルタイムの周波数データを取得し、状態を更新
      analyserNode.getByteFrequencyData(dataArray);
      setFrequencyData(new Uint8Array(dataArray)); // データをコピーして渡す
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyserNode]); // analyserNodeがセットされた後に開始

  const handleFileSelected = (file: File) => {
    setAudioFile(file);
  };

  const handleModelSelect = (preset: Preset) => {
    setSelectedPreset(preset);
  };

  return (
    <div className="relative min-h-screen">
      {/* ビジュアライザーコンポーネントを背景に配置 */}
      <div className="absolute inset-0 z-0">
        <Visualizer
          modelUrl={selectedPreset?.modelUrl || null}
          scaleFactor={selectedPreset?.scaleFactor}
          frequencyData={frequencyData}
        />
      </div>

      {/* 上部のUI */}
      <div className="absolute top-0 left-0 right-0 z-10 p-8">
        <div className="w-ful">
          <h1 className="mb-10 text-xl font-bold text-white [text-shadow:0_0_10px_theme(colors.cyan.300)]">
            Music Visualizer
          </h1>
        </div>
        <div className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-black/20 p-2 backdrop-blur-[4px]">
          <h2
            className="flex gap-2 text-base font-semibold text-white/80 truncate"
            title={audioFile?.name}
          >
            {audioFile ? (
              <span className="relative flex items-center gap-4 before:h-5 before:w-5 before:bg-[url('/icon_note.svg')] before:bg-contain before:bg-center before:bg-no-repeat">
                {audioFile.name}
              </span>
            ) : (
              "Select music file"
            )}
          </h2>
        </div>
      </div>

      {/* 左側のUI */}
      <div className="absolute top-0 left-0 z-10 flex h-screen w-[30%] max-w-[300px] flex-col items-center justify-center p-8">
        <FileUploader onFileSelect={handleFileSelected} />
      </div>

      {/* 右側のUI */}
      <div className="absolute top-0 right-0 z-10 flex h-screen w-[30%] max-w-[300px] flex-col items-center justify-center p-8">
        <div className="w-full">
          <PresetSelector
            presets={presets}
            onSelect={handleModelSelect}
            selectedPreset={selectedPreset}
          />
        </div>
      </div>

      {/* 下部のUI */}
      {audioFile && (
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center p-8">
          <AudioPlayer
            audioFile={audioFile}
            audioRef={audioRef}
            onPlay={handlePlay}
          />
        </div>
      )}
    </div>
  );
};

export default ClientPage;
