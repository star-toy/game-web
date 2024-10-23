import { PuzzleBlock } from "./puzzle-block";
import { BoardStates } from "./board-states";
import { BoardSelections } from "./board-selections";
import { BLOCK_GAP, BLOCK_MARGIN } from "@/src/shared/constants";

export class PuzzleBoard {
  public readonly states = new BoardStates(this);
  public readonly selections = new BoardSelections(this);

  private blocks: PuzzleBlock[] = [];

  constructor(private readonly image: HTMLImageElement) {}

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.image.complete) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const block of this.blocks.filter((b) => !this.selections.has(b))) {
      ctx.drawImage(this.image, ...block.area);
    }

    for (const block of this.selections.blocks) {
      ctx.drawImage(this.image, ...block.area);
    }

    this.selections.draw(ctx);
  }

  public setPieces(pieces: number) {
    this.createBlocks(pieces);
  }

  public moveBlocksToEnd(blocksToMove: PuzzleBlock[]) {
    this.blocks = [
      ...this.blocks.filter((b) => !blocksToMove.includes(b)),
      ...blocksToMove,
    ];
  }

  public getBlockAtPosition(x: number, y: number) {
    return this.blocks.find((block) => block.includes(x, y)) ?? null;
  }

  public handleMouseDown = (event: MouseEvent) => {
    this.states.current?.handleMouseDown(event);
  };
  public handleTouchStart = (event: TouchEvent) => {
    this.states.current?.handleTouchStart(event);
  };

  public handleMouseMove = (event: MouseEvent) => {
    this.states.current?.handleMouseMove(event);
  };
  public handleTouchMove = (event: TouchEvent) => {
    this.states.current?.handleTouchMove(event);
  };

  public handleMouseUp = (event: MouseEvent) => {
    this.states.current?.handleMouseUp(event);
  };
  public handleTouchEnd = (event: TouchEvent) => {
    this.states.current?.handleTouchEnd(event);
  };

  private createBlocks(pieces: number) {
    const blocks: PuzzleBlock[] = [];

    const square = Math.sqrt(pieces);

    const blockWidth = this.image.width / square;
    const blockHeight = this.image.height / square;

    for (let i = 0; i < square; i += 1) {
      for (let j = 0; j < square; j += 1) {
        blocks.push(
          new PuzzleBlock(
            i * blockWidth,
            j * blockHeight,
            blockWidth,
            blockHeight,
            BLOCK_MARGIN + i * (blockWidth + BLOCK_GAP),
            BLOCK_MARGIN + j * (blockHeight + BLOCK_GAP)
          )
        );
      }
    }

    this.blocks = blocks;
  }
}
