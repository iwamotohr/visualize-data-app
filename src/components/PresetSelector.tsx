"use client";

import React from "react";
import { Preset } from "@/lib/microcms";

interface PresetSelectorProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  onSelect: (preset: Preset) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  presets,
  selectedPreset,
  onSelect,
}) => {
  return (
    <div className="w-full space-y-3 rounded-lg bg-black/20 p-4 border border-white/50 backdrop-blur-[4px]">
      <h2 className="text-sm font-semibold text-white">VISUALIZER CONTROLS</h2>
      <h3 className="text-sm font-semibold text-white">MODELS</h3>
      {presets.map((preset) => {
        const isSelected = preset.id === selectedPreset?.id;
        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`w-full px-4 py-2 text-center text-white rounded-md transition-all border
              ${
                isSelected
                  ? "border-cyan-300 shadow-[0_0_8px_theme(colors.cyan.300)]"
                  : "border-white/50 hover:border-cyan-500 hover:shadow-[0_0_6px_theme(colors.cyan.300)]"
              }`}
          >
            {preset.title}
          </button>
        );
      })}
    </div>
  );
};

export default PresetSelector;
