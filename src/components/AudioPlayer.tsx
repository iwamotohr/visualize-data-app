"use client";

import React, { useEffect, RefObject, useState, useRef } from "react";

interface AudioPlayerProps {
  audioFile: File;
  audioRef: RefObject<HTMLAudioElement | null>;
  onPlay?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioFile,
  audioRef,
  onPlay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // audioFileが変更されたときにURLをセット
  useEffect(() => {
    if (audioRef.current && audioFile) {
      const url = URL.createObjectURL(audioFile);
      audioRef.current.src = url;

      // クリーンアップ関数
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioFile, audioRef]);

  // 再生状態と時間の更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const progressBar = progressBarRef.current;
      const clickPosition =
        e.clientX - progressBar.getBoundingClientRect().left;
      const newTime = (clickPosition / progressBar.offsetWidth) * duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex items-center justify-center space-x-4 p-4 bg-black/20 rounded-[100px] backdrop-blur-[4px] border border-white/30">
      {/* 再生/一時停止ボタン */}
      <button
        onClick={togglePlayPause}
        className="p-2 rounded-full text-white/80 border border-white/50 hover:bg-white/10 transition-colors coursor-pointer"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.016h3.984v13.969H6z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8.016 5.016l10.969 6.984-10.969 6.984V5.016z"></path>
          </svg>
        )}
      </button>

      {/* 時間表示 */}
      <span className="text-xs text-white/60 font-mono w-12 text-center">
        {formatTime(currentTime)}
      </span>

      {/* プログレスバー */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="flex-1 h-2 bg-white/10 rounded-full cursor-pointer group"
      >
        <div
          className="h-full bg-cyan-300 rounded-full shadow-[0_0_4px_theme(colors.cyan.300)]"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="h-full w-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-cyan-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* 時間表示 */}
      <span className="text-xs text-white/60 font-mono w-12 text-center">
        {formatTime(duration)}
      </span>

      {/* audio要素は非表示 */}
      <audio ref={audioRef} onPlay={onPlay} className="hidden" />
    </div>
  );
};

export default AudioPlayer;
