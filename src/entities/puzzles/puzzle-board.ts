import { PuzzleBlock } from "./puzzle-block";
import { BoardStates } from "./board-states";
import { BoardSelections } from "./board-selections";
import { BoardBlocks } from "./board-blocks";

export class PuzzleBoard {
  public readonly states = new BoardStates(this);
  public readonly selections = new BoardSelections(this);
  public readonly blocks = new BoardBlocks(this);

  constructor(public readonly image: HTMLImageElement) {}

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.image.complete) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.blocks.draw(ctx);

    this.selections.draw(ctx);
  }

  public initializeBlocks(pieces: number) {
    this.blocks.initializeBlocks(pieces);
  }
  public getBlockAtPosition(x: number, y: number) {
    return this.blocks.getBlockAtPosition(x, y);
  }
  public moveBlocksToEnd(blocksToMove: PuzzleBlock[]) {
    this.blocks.moveBlocksToEnd(blocksToMove);
  }
  public findNearby(block: PuzzleBlock) {
    return this.blocks.findNearby(block);
  }
  public getBlockByIndices(row: number, column: number) {
    return this.blocks.getBlockByIndices(row, column);
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
}
