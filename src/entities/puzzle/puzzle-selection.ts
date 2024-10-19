import { SELECTION_COLOR, SELECTION_LINE_WIDTH } from "@/src/shared/constants";
import { Block } from "./puzzle-block";

class BoardSelections {
  public blocks: Block[] = [];

  public subscribe(block: Block) {
    if (!this.blocks.includes(block)) {
      this.blocks.push(block);
    }
  }

  public unsubscribe(block: Block) {
    this.blocks = this.blocks.filter((b) => b !== block);
  }

  public clear() {
    this.blocks = [];
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      const [x, y, width, height] = block.area;

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

export { BoardSelections };
