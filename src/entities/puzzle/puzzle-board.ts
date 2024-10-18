import { Block } from "./puzzle-block";

interface Board {
  draw: (ctx: CanvasRenderingContext2D) => void;
  subscribe: (block: Block) => void;
}

class PuzzleBoard implements Board {
  public blocks: Block[] = [];

  public async draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      block.draw(ctx);
    }
  }

  public subscribe(block: Block) {
    this.blocks.push(block);
  }
}

export { type Board, PuzzleBoard };
