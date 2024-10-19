import { Block } from "./puzzle-block";
import { BoardStates } from "./puzzle-state";

class PuzzleBoard {
  public blocks: Block[] = [];
  public states = new BoardStates(this);

  public async draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      block.draw(ctx);
    }
  }

  public subscribe(block: Block) {
    this.blocks.push(block);
  }

  public handleMouseDown(event: MouseEvent) {
    this.states.current?.handleMouseDown(event);
  }

  public handleMouseMove(event: MouseEvent) {
    this.states.current?.handleMouseMove(event);
  }

  public handleMouseUp(event: MouseEvent) {
    this.states.current?.handleMouseUp(event);
  }
}

export default PuzzleBoard;
