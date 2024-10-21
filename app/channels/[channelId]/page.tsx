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

        const image = new Image();
        image.onload = () => {
          for (let i = 0; i < 3; i += 1) {
            for (let j = 0; j < 3; j += 1) {
              ctx.drawImage(
                image,
                i * (image.width / 3),
                j * (image.height / 3),
                image.width / 3,
                image.height / 3,
                100 + i * (image.width / 3) + i * 50,
                100 + j * (image.height / 3) + j * 50,
                image.width / 3,
                image.height / 3
              );
            }
          }
        };

        image.src =
          "https://image.aladin.co.kr/product/5592/81/cover500/3581198452_1.jpg";
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
