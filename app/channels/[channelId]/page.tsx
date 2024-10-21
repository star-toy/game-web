"use client";

import { useEffect, useRef } from "react";

import { useClientWidthHeight } from "@/src/shared/hooks/use-client-width-height";

const ChannelPage = ({
  params: { channelId },
}: {
  params: { channelId: string };
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { width, height } = useClientWidthHeight(containerRef);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const devicePixelRatio = window.devicePixelRatio ?? 1;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        canvas.width = Math.floor(width * devicePixelRatio);
        canvas.height = Math.floor(height * devicePixelRatio);

        ctx.scale(devicePixelRatio, devicePixelRatio);
      }
    }
  }, [width, height]);

  return (
    <section ref={containerRef} className="flex w-full h-screen">
      <canvas ref={canvasRef} />
    </section>
  );
};

export default ChannelPage;
