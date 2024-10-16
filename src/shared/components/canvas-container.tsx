"use client";

import { RefObject, useEffect, useRef } from "react";

import { useClientWidthHeight } from "../hooks/use-client-width-height";

import CanvasService from "@/src/entities/canvas-service";

const CanvasContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const canvasServiceRef = useRef<null | CanvasService>(null);

  const { width, height } = useClientWidthHeight(containerRef);

  useEffect(() => {
    if (canvasRef.current) {
      canvasServiceRef.current = new CanvasService(canvasRef.current);
      canvasServiceRef.current.resize(width, height);
    }
  }, [canvasRef.current]);

  useEffect(() => {
    canvasServiceRef.current?.resize(width, height);
  }, [width, height]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default CanvasContainer;
