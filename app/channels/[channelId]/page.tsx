"use client";

import { useEffect, useRef } from "react";

import { useClientWidthHeight } from "@/src/shared/hooks/use-client-width-height";

const MOCK_IMAGE_URL =
  "https://image.aladin.co.kr/product/5592/81/cover500/3581198452_1.jpg";

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

  useEffect(() => {
    (async () => {
      const imageUrl = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(MOCK_IMAGE_URL);
        }, 1000)
      );

      const renderer = new Renderer(imageUrl as string);

      const ctx = canvasRef.current?.getContext("2d");

      if (ctx) {
        let requestId: number;
        const requestAnimation = () => {
          requestId = window.requestAnimationFrame(requestAnimation);

          renderer.render(ctx);
        };

        requestAnimation();

        return () => {
          window.cancelAnimationFrame(requestId);
        };
      }
    })();
  }, [channelId]);

  return (
    <section ref={containerRef} className="flex w-full h-screen">
      <canvas ref={canvasRef} />
    </section>
  );
};

export default ChannelPage;

class Renderer {
  private image: HTMLImageElement;

  constructor(source: string) {
    this.image = new Image();

    this.image.src = source;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.image.complete) return;

    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        ctx.drawImage(
          this.image,
          i * (this.image.width / 3),
          j * (this.image.height / 3),
          this.image.width / 3,
          this.image.height / 3,
          100 + i * (this.image.width / 3) + i * 50,
          100 + j * (this.image.height / 3) + j * 50,
          this.image.width / 3,
          this.image.height / 3
        );
      }
    }
  }
}
