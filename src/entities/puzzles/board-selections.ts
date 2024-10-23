import { PuzzleBlock } from "./puzzle-block";
import { PuzzleBoard } from "./puzzle-board";

import { SELECTION_COLOR, SELECTION_LINE_WIDTH } from "@/src/shared/constants";

export class BoardSelections {
  public blocks: PuzzleBlock[] = [];

  constructor(private readonly board: PuzzleBoard) {}

  public select(block: PuzzleBlock) {
    if (!this.blocks.includes(block)) {
      this.blocks.push(block);
    }
  }

  public deselect(block: PuzzleBlock) {
    this.blocks = this.blocks.filter((b) => b !== block);
  }

  public has(block: PuzzleBlock) {
    return this.blocks.includes(block);
  }

  public clear() {
    if (this.blocks.length) {
      this.board.moveBlocksToEnd(this.blocks);
    }

    this.blocks = [];
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      const [, , width, height, x, y] = block.area;

      ctx.strokeStyle = SELECTION_COLOR;
      ctx.lineWidth = SELECTION_LINE_WIDTH;

      ctx.strokeRect(
        x - SELECTION_LINE_WIDTH * 2,
        y - SELECTION_LINE_WIDTH * 2,
        width + SELECTION_LINE_WIDTH * 4,
        height + SELECTION_LINE_WIDTH * 4
      );
    }
  }
}
