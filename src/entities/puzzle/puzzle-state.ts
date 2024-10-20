import { SELECTION_COLOR, SELECTION_LINE_WIDTH } from "@/src/shared/constants";
import PuzzleBoard from "./puzzle-board";

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
}

class IdleState implements State {
  constructor(readonly board: PuzzleBoard) {}

  public draw(ctx: CanvasRenderingContext2D) {}

  public enter(args: any) {}

  public exit(args: any) {}

  public handleMouseDown(event: MouseEvent) {
    const block = this.board.getBlockAtPosition(event.clientX, event.clientY);

    if (block) {
      this.board.selections.subscribe(block);
    } else {
      this.board.selections.clear();
    }

    this.board.states.push(
      new MultipleSelectState(
        this.board,
        event.clientX,
        event.clientY,
        event.clientX,
        event.clientY
      )
    );
  }

  public handleMouseMove(event: MouseEvent) {}

  public handleMouseUp(event: MouseEvent) {}
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
    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = SELECTION_LINE_WIDTH;

    ctx.strokeRect(
      this.startX,
      this.startY,
      this.x - this.startX,
      this.y - this.startY
    );
  }

  public enter(args: any) {}

  public exit(args: any) {}

  public handleMouseDown(event: MouseEvent) {}

  public handleMouseMove(event: MouseEvent) {
    this.x = event.clientX;
    this.y = event.clientY;

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
}

export { BoardStates, IdleState, MultipleSelectState };
