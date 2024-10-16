import { RefObject, useEffect, useRef } from "react";

export const useCanvas = (canvasWidth: number, canvasHeight: number) => {
  const canvasRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const devicePixelRatio = window.devicePixelRatio ?? 1;

        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        canvas.width = Math.floor(canvasWidth * devicePixelRatio);
        canvas.height = Math.floor(canvasHeight * devicePixelRatio);

        ctx.scale(devicePixelRatio, devicePixelRatio);
      }
    }
  }, [canvasWidth, canvasHeight]);

  return { canvasRef };
};
