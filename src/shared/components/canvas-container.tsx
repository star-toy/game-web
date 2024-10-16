"use client";

import { useRef } from "react";

import { useCanvas } from "../hooks/use-canvas";
import { useClientWidthHeight } from "../hooks/use-client-width-height";

const CanvasContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width, height } = useClientWidthHeight(containerRef);
  const { canvasRef } = useCanvas(width, height);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default CanvasContainer;
