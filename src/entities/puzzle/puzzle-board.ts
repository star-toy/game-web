import { Block } from "./puzzle-block";

class PuzzleBoard {
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

export default PuzzleBoard;
