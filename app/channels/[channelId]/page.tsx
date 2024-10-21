"use client";

import { useEffect, useRef, useState } from "react";

import { useClientWidthHeight } from "@/src/shared/hooks/use-client-width-height";

const MOCK_IMAGE_URL =
  "https://image.aladin.co.kr/product/5592/81/cover500/3581198452_1.jpg";
const MOCK_PIECES = 16;

const ChannelPage = ({
  params: { channelId },
}: {
  params: { channelId: string };
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [board, setBoard] = useState<null | Board>(null);

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

      const image = await new ImageLoader().loadImage(imageUrl as string);

      const board = new Board(image);

      board.setPieces(MOCK_PIECES);

      setBoard(board);

      const ctx = canvasRef.current?.getContext("2d");

      if (ctx) {
        let requestId: number;
        const requestAnimation = () => {
          requestId = window.requestAnimationFrame(requestAnimation);

          board.render(ctx);
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

class ImageLoader {
  private image: HTMLImageElement = new Image();

  public async loadImage(source: string) {
    const image = new Image();

    return new Promise<HTMLImageElement>((resolve) => {
      image.onload = () => {
        resolve(image);
      };

      image.src = source;
    });
  }
}

interface State {
  readonly board: Board;

  draw(ctx: CanvasRenderingContext2D): void;

  enter(args?: any): void;
  exit(args?: any): void;

  handleMouseDown(event: MouseEvent): void;
  handleMouseMove(event: MouseEvent): void;
  handleMouseUp(event: MouseEvent): void;
}

class IdleState implements State {
  constructor(readonly board: Board) {}

  public draw(ctx: CanvasRenderingContext2D) {}

  public enter(args: any) {}

  public exit(args: any) {}

  public handleMouseDown(event: MouseEvent) {}

  public handleMouseMove(event: MouseEvent) {
    // TODO: block hover 시점에 마우스 커서 변경
  }

  public handleMouseUp(event: MouseEvent) {}
}

class BoardStates {
  constructor(private readonly board: Board) {}

  private states: State[] = [new IdleState(this.board)];

  public push(state: State, args?: any) {
    this.current?.exit(args);
    this.states.push(state);
    this.current?.enter(args);
  }

  public pop(args?: any) {
    this.current?.exit(args);
    this.states.pop();
    this.current?.enter(args);
  }

  public get current() {
    return this.states.at(-1) ?? null;
  }
}

class Board {
  public readonly states = new BoardStates(this);

  private blocks: Block[] = [];

  constructor(private readonly image: HTMLImageElement) {}

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.image.complete) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const block of this.blocks) {
      ctx.drawImage(this.image, ...block.area);
    }
  }

  public setPieces(pieces: number) {
    this.createBlocks(pieces);
  }

  private createBlocks(pieces: number) {
    const blocks: Block[] = [];

    const square = Math.sqrt(pieces);

    const blockWidth = this.image.width / square;
    const blockHeight = this.image.height / square;

    const margin = 100;
    const gap = 50;

    for (let i = 0; i < square; i += 1) {
      for (let j = 0; j < square; j += 1) {
        blocks.push(
          new Block(
            i * blockWidth,
            j * blockHeight,
            blockWidth,
            blockHeight,
            margin + i * (blockWidth + gap),
            margin + j * (blockHeight + gap)
          )
        );
      }
    }

    this.blocks = blocks;
  }
}
