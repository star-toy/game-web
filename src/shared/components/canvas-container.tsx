"use client";

import { RefObject, useEffect, useRef } from "react";

import { useClientWidthHeight } from "../hooks/use-client-width-height";

import CanvasService from "@/src/entities/canvas-service";
import { Board } from "@/src/entities/puzzle-board";

interface Props {
  board: Board;
}

const CanvasContainer = ({ board }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const canvasServiceRef = useRef<null | CanvasService>(null);

  const { width, height } = useClientWidthHeight(containerRef);

  useEffect(() => {
    if (canvasRef.current) {
      canvasServiceRef.current = new CanvasService(canvasRef.current, board);
      canvasServiceRef.current.resize(width, height);

      let requestId: number;
      const requestAnimation = () => {
        requestId = window.requestAnimationFrame(requestAnimation);

        canvasServiceRef.current?.render();
      };

      requestAnimation();

      return () => {
        window.cancelAnimationFrame(requestId);
      };
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
