import { Block, ImageBlock } from "./puzzle-block";
import { BoardStates } from "./puzzle-state";
import { BoardSelections } from "./puzzle-selection";

const MOCK_IMAGE_URL =
  "https://image.aladin.co.kr/product/5592/81/cover500/3581198452_1.jpg";

class PuzzleBoard {
  public blocks: Block[] = [];
  public states = new BoardStates(this);
  public selections = new BoardSelections();

  private width = 0;
  private height = 0;

  private id = "";

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public async fetch(channelId: string) {
    if (this.id !== channelId) {
      this.id = channelId;
      this.blocks = [new ImageBlock(0, 0, 0, 0, MOCK_IMAGE_URL)];
      this.states = new BoardStates(this);
      this.selections = new BoardSelections();
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      block.draw(ctx);
    }

    this.selections.draw(ctx);

    this.states.current?.draw(ctx);
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
  public handleTouchStart = (event: TouchEvent) => {
    this.states.current?.handleTouchStart(event);
  };
  public handleTouchMove = (event: TouchEvent) => {
    this.states.current?.handleTouchMove(event);
  };
  public handleTouchEnd = (event: TouchEvent) => {
    this.states.current?.handleTouchEnd(event);
  };
}

export default PuzzleBoard;
