import { BLOCK_GAP, BLOCK_MARGIN } from "@/src/shared/constants";
import { PuzzleBlock } from "./puzzle-block";
import { PuzzleBoard } from "./puzzle-board";

export class BoardBlocks {
  private blocks: PuzzleBlock[] = [];

  constructor(private readonly board: PuzzleBoard) {}

  public initializeBlocks(pieces: number) {
    this.blocks = this.createBlocks(
      this.board.image.width,
      this.board.image.height,
      pieces
    );
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks.filter(
      (b) => !this.board.selections.has(b)
    )) {
      ctx.drawImage(this.board.image, ...block.area);
    }

    for (const block of this.board.selections.blocks) {
      ctx.drawImage(this.board.image, ...block.area);
    }
  }

  public getBlockAtPosition(x: number, y: number) {
    return this.blocks.find((block) => block.includes(x, y)) ?? null;
  }

  public moveBlocksToEnd(blocksToMove: PuzzleBlock[]) {
    this.blocks = [
      ...this.blocks.filter((b) => !blocksToMove.includes(b)),
      ...blocksToMove,
    ];
  }

  private createBlocks(width: number, height: number, pieces: number) {
    const blocks: PuzzleBlock[] = [];

    const square = Math.sqrt(pieces);

    const blockWidth = width / square;
    const blockHeight = height / square;

    for (let i = 0; i < square; i += 1) {
      for (let j = 0; j < square; j += 1) {
        blocks.push(
          new PuzzleBlock(
            i,
            j,
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

    return blocks;
  }
}
