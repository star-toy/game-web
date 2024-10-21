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

      const renderer = new Renderer();

      const blocks = await renderer.loadImage(imageUrl as string);

      const ctx = canvasRef.current?.getContext("2d");

      if (ctx) {
        let requestId: number;
        const requestAnimation = () => {
          requestId = window.requestAnimationFrame(requestAnimation);

          renderer.render(ctx, blocks);
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

type CanvasDrawImageParams = Parameters<
  CanvasRenderingContext2D["drawImage"]
> extends [CanvasImageSource, ...infer Rest]
  ? Rest
  : never;

class Block {
  constructor(
    private readonly subX: number,
    private readonly subY: number,
    private readonly width: number,
    private readonly height: number,
    private x: number,
    private y: number
  ) {}

  get area(): CanvasDrawImageParams {
    return [
      this.subX,
      this.subY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    ] as const;
  }
}

class Renderer {
  private image: HTMLImageElement = new Image();

  public async loadImage(source: string) {
    return new Promise<Block[]>((resolve) => {
      this.image.onload = () => {
        resolve(this.createBlocks());
      };

      this.image.src = source;
    });
  }

  public render(ctx: CanvasRenderingContext2D, blocks: Block[]) {
    if (!this.image.complete) return;

    for (const block of blocks) {
      ctx.drawImage(this.image, ...block.area);
    }
  }

  private createBlocks() {
    const blocks: Block[] = [];

    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        blocks.push(
          new Block(
            i * (this.image.width / 3),
            j * (this.image.height / 3),
            this.image.width / 3,
            this.image.height / 3,
            100 + i * (this.image.width / 3) + i * 50,
            100 + j * (this.image.height / 3) + j * 50
          )
        );
      }
    }

    return blocks;
  }
}
