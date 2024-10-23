import { BLOCK_GAP, BLOCK_MARGIN } from "@/src/shared/constants";
import { PuzzleBlock } from "./puzzle-block";
import { PuzzleBoard } from "./puzzle-board";

export class BoardBlocks {
  private blocks: PuzzleBlock[] = [];

  private maxRow = 0;
  private maxColumn = 0;

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
      ctx.drawImage(this.board.image, ...block.bounds);
    }

    for (const block of this.board.selections.blocks) {
      ctx.drawImage(this.board.image, ...block.bounds);
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

  public findNearby(block: PuzzleBlock) {
    const blocks: PuzzleBlock[] = [];

    const { row, column } = block.gridIndices;

    if (0 < column) {
      blocks.push(
        this.blocks.find(({ gridIndices: { column: c } }) => c === column - 1)!
      );
    }

    if (column < this.maxColumn) {
      blocks.push(
        this.blocks.find(({ gridIndices: { column: c } }) => c === column + 1)!
      );
    }

    if (0 < row) {
      blocks.push(
        this.blocks.find(({ gridIndices: { row: r } }) => r === row - 1)!
      );
    }

    if (row < this.maxRow) {
      blocks.push(
        this.blocks.find(({ gridIndices: { row: r } }) => r === row + 1)!
      );
    }

    return blocks as
      | [PuzzleBlock, PuzzleBlock]
      | [PuzzleBlock, PuzzleBlock, PuzzleBlock]
      | [PuzzleBlock, PuzzleBlock, PuzzleBlock, PuzzleBlock];
  }

  public getBlockByIndices(row: number, column: number): null | PuzzleBlock {
    if (row < 0 || column < 0) return null;
    if (row > this.maxRow || column > this.maxColumn) return null;

    return (
      this.blocks.find(
        (block) =>
          block.gridIndices.row === row && block.gridIndices.column === column
      ) ?? null
    );
  }

  // TODO: 완전제곱수가 아닐 때
  private createBlocks(width: number, height: number, pieces: number) {
    const blocks: PuzzleBlock[] = [];

    const square = Math.sqrt(pieces);

    const blockWidth = width / square;
    const blockHeight = height / square;

    this.maxRow = square - 1;
    this.maxColumn = square - 1;

    for (let i = 0; i <= this.maxRow; i += 1) {
      for (let j = 0; j <= this.maxColumn; j += 1) {
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
