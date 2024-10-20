import { Block } from "./puzzle-block";
import { BoardStates } from "./puzzle-state";
import { BoardSelections } from "./puzzle-selection";

class PuzzleBoard {
  public blocks: Block[] = [];
  public states = new BoardStates(this);
  public selections = new BoardSelections();

  public draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      block.draw(ctx);
    }

    this.selections.draw(ctx);

    this.states.current?.draw(ctx);
  }

  public subscribe(block: Block) {
    this.blocks.push(block);
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
}

export default PuzzleBoard;
