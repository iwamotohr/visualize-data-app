"use client";

import React, { useState, useRef, ChangeEvent } from "react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full p-6 text-white border-2 border-dashed rounded-lg backdrop-blur-[4px] transition-colors ${
        isDragging
          ? "border-cyan-400 shadow-[0_0_10px_theme(colors.cyan.300)]"
          : "border-white/50"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <svg
        className="h-8 w-8 text-cyan-300 [filter:drop-shadow(0_0_4px_theme(colors.cyan.100))]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4L12 20M12 4L18 10M12 4L6 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-2 font-semibold text-center">
        DRAG &amp; DROP
        <br />
        YOUR MUSIC HERE
      </p>
      <button
        onClick={handleButtonClick}
        className="mt-4 px-4 py-2 text-sm text-white rounded-[100px] transition-all cursor-pointer border border-cyan-300 shadow-[0_0_6px_theme(colors.cyan.300)] hover:shadow-[0_0_10px_theme(colors.cyan.300)]"
      >
        OR BROWSE FILES
      </button>
    </div>
  );
};

export default FileUploader;
