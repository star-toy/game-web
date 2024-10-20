import {
  SELECTION_COLOR,
  SELECTION_FILL_COLOR,
  SELECTION_LINE_WIDTH,
  SELECTION_OPACITY,
} from "@/src/shared/constants";
import PuzzleBoard from "./puzzle-board";

interface Point {
  clientX: number;
  clientY: number;
}

class BoardStates {
  constructor(private readonly board: PuzzleBoard) {}

  private states: State[] = [new IdleState(this.board)];

  public push(state: State, args?: any) {
    this.current?.exit(args);
    this.states.push(state);
    this.current?.enter(args);
  }

  public pop() {
    this.states.pop();
  }

  public get current() {
    return this.states.at(-1) ?? null;
  }
}

interface State {
  readonly board: PuzzleBoard; // NOTE: interface 에서는 private 을 지정할 수 있는 방법이 없음.

  draw(ctx: CanvasRenderingContext2D): void;

  enter(args?: any): void;
  exit(args?: any): void;

  handleMouseDown(event: MouseEvent): void;
  handleMouseMove(event: MouseEvent): void;
  handleMouseUp(event: MouseEvent): void;

  handleTouchStart(event: TouchEvent): void;
  handleTouchMove(event: TouchEvent): void;
  handleTouchEnd(event: TouchEvent): void;
}

class IdleState implements State {
  constructor(readonly board: PuzzleBoard) {}

  public draw(ctx: CanvasRenderingContext2D) {}

  public enter(args: any) {}

  public exit(args: any) {}

  public handleMouseDown(event: MouseEvent) {
    this.startSelectionArea(event);
  }

  public handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.startSelectionArea(event.touches[0]);
    } else {
      // TODO: panning
    }
  }

  public handleMouseMove(event: MouseEvent) {}
  public handleTouchMove(event: TouchEvent) {}

  public handleMouseUp(event: MouseEvent) {}
  public handleTouchEnd(event: TouchEvent) {}

  private startSelectionArea({ clientX, clientY }: Point) {
    const block = this.board.getBlockAtPosition(clientX, clientY);

    if (block) {
      this.board.selections.subscribe(block);
    } else {
      this.board.selections.clear();
    }

    this.board.states.push(
      new MultipleSelectState(this.board, clientX, clientY, clientX, clientY)
    );
  }
}

class MultipleSelectState implements State {
  constructor(
    readonly board: PuzzleBoard,
    private readonly startX: number,
    private readonly startY: number,
    public x: number,
    public y: number
  ) {}

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.beginPath();

    ctx.fillStyle = SELECTION_FILL_COLOR;
    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = SELECTION_LINE_WIDTH;
    ctx.globalAlpha = SELECTION_OPACITY;

    ctx.rect(
      this.startX,
      this.startY,
      this.x - this.startX,
      this.y - this.startY
    );

    ctx.fill();
    ctx.stroke();

    ctx.closePath();

    ctx.restore();
  }

  public enter(args: any) {}

  public exit(args: any) {}

  public handleMouseDown(event: MouseEvent) {}
  public handleTouchStart(event: TouchEvent) {}

  public handleMouseMove(event: MouseEvent) {
    this.resizeSelectionArea(event);
  }
  public handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.resizeSelectionArea(event.touches[0]);
    }
  }

  private resizeSelectionArea({ clientX, clientY }: Point) {
    this.x = clientX;
    this.y = clientY;

    this.board.selections.clear();

    for (const x of [this.startX, this.x]) {
      for (const y of [this.startY, this.y]) {
        const block = this.board.getBlockAtPosition(x, y);

        if (block) {
          this.board.selections.subscribe(block);
        }
      }
    }
  }

  public handleMouseUp(event: MouseEvent) {
    this.board.states.pop();
  }
  public handleTouchEnd(event: TouchEvent) {
    this.board.states.pop();
  }
}

export { BoardStates, IdleState, MultipleSelectState };
