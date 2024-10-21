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

      setBoard(board);

      board.setPieces(MOCK_PIECES);

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

  useEffect(() => {
    if (!canvasRef.current || !board) return;

    canvasRef.current.addEventListener("mousedown", board.handleMouseDown);

    canvasRef.current.addEventListener("mousemove", board.handleMouseMove);

    canvasRef.current.addEventListener("mouseup", board.handleMouseUp);

    return () => {
      canvasRef.current!.removeEventListener(
        "mousedown",
        board.handleMouseDown
      );

      canvasRef.current!.removeEventListener(
        "mousemove",
        board.handleMouseMove
      );

      canvasRef.current!.removeEventListener("mouseup", board.handleMouseUp);
    };
  }, [canvasRef.current, board]);

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
  private originX = 0;
  private originY = 0;

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

  public includes(x: number, y: number) {
    return (
      this.x <= x &&
      this.x + this.width >= x &&
      this.y <= y &&
      this.y + this.height >= y
    );
  }

  public move(x: number, y: number) {
    this.x += x - this.x - this.originX;
    this.y += y - this.y - this.originY;
  }

  public setOrigin(x: number, y: number) {
    this.originX = x - this.x;
    this.originY = y - this.y;
  }

  public resetOrigin() {
    this.originX = 0;
    this.originY = 0;
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

  public handleMouseDown({ clientX, clientY }: Point) {
    const block = this.board.getBlockAtPosition(clientX, clientY);

    if (block) {
      this.board.states.push(new SingleSelectState(this.board, block), {
        clientX,
        clientY,
      });
    } else {
      // TODO: multiple select
    }
  }

  public handleMouseMove(event: MouseEvent) {
    // TODO: block hover 시점에 마우스 커서 변경
  }

  public handleMouseUp(event: MouseEvent) {}
}

interface Point {
  readonly clientX: number;
  readonly clientY: number;
}

class SingleSelectState implements State {
  constructor(readonly board: Board, private readonly block: Block) {}

  public draw(ctx: CanvasRenderingContext2D) {}

  public enter({ clientX, clientY }: Point) {
    this.block.setOrigin(clientX, clientY);
  }

  public exit(args: any) {
    this.block.resetOrigin();
  }

  public handleMouseDown(event: MouseEvent) {}

  public handleMouseMove({ clientX, clientY }: Point) {
    this.block.move(clientX, clientY);
  }

  public handleMouseUp(event: MouseEvent) {
    this.board.states.pop();
  }
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

  public getBlockAtPosition(x: number, y: number) {
    return this.blocks.find((block) => block.includes(x, y)) ?? null;
  }

  public handleMouseDown = (event: MouseEvent) => {
    this.states.current?.handleMouseDown(event);
  };

  public handleMouseMove = (event: MouseEvent) => {
    this.states.current?.handleMouseMove(event);
  };

  public handleMouseUp = (event: MouseEvent) => {
    this.states.current?.handleMouseUp(event);
  };

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
