"use client";

import React, { useEffect, RefObject } from "react";

interface AudioPlayerProps {
  audioFile: File;
  audioRef: RefObject<HTMLAudioElement | null>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile, audioRef }) => {
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

  return (
    <div className="flex items-center justify-center space-x-4">
      <audio ref={audioRef} controls />
    </div>
  );
};

export default AudioPlayer;
