import { PuzzleBlock } from "./puzzle-block";

import { SELECTION_COLOR, SELECTION_LINE_WIDTH } from "@/src/shared/constants";
import { PuzzleBoard } from "./puzzle-board";

interface State {
  readonly board: PuzzleBoard;

  draw(ctx: CanvasRenderingContext2D): void;

  enter(args?: any): void;

  exit(args?: any): void;

  handleMouseDown(event: MouseEvent): void;
  handleTouchStart(event: TouchEvent): void;

  handleMouseMove(event: MouseEvent): void;
  handleTouchMove(event: TouchEvent): void;

  handleMouseUp(event: MouseEvent): void;
  handleTouchEnd(event: TouchEvent): void;
}

class IdleState implements State {
  constructor(readonly board: PuzzleBoard) {}

  public draw(ctx: CanvasRenderingContext2D) {}

  public enter(args: any) {}

  public exit(args: any) {}

  public handleMouseDown({ clientX, clientY }: Point) {
    this.handleInteractionStart({ clientX, clientY });
  }

  public handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.handleInteractionStart(event.touches[0]);
    }
  }

  public handleMouseMove(event: MouseEvent) {
    // TODO: block hover 시점에 마우스 커서 변경
  }

  public handleTouchMove(event: TouchEvent) {}

  public handleMouseUp(event: MouseEvent) {}

  public handleTouchEnd(event: TouchEvent) {}

  private handleInteractionStart({ clientX, clientY }: Point) {
    const block = this.board.getBlockAtPosition(clientX, clientY);

    if (block) {
      if (!this.board.selections.has(block)) {
        this.board.selections.clear();
        this.board.selections.select(block);
      }

      this.board.states.push(
        new SingleSelectState(this.board, block, clientX, clientY)
      );
    } else {
      this.board.selections.clear();
      // TODO: multiple select
    }
  }
}

interface Point {
  readonly clientX: number;
  readonly clientY: number;
}

class SingleSelectState implements State {
  constructor(
    readonly board: PuzzleBoard,
    private readonly block: PuzzleBlock,
    private readonly offsetX: number,
    private readonly offsetY: number
  ) {
    const { x, y } = this.block.position;

    this.offsetX = offsetX - x;
    this.offsetY = offsetY - y;
  }

  public draw(ctx: CanvasRenderingContext2D) {}

  public enter() {
    // TODO: mouse cursor
  }

  public exit(args: any) {
    // TODO: mouse cursor reset
  }

  public handleMouseDown(event: MouseEvent) {}

  public handleTouchStart(event: TouchEvent) {}

  public handleMouseMove({ clientX, clientY }: Point) {
    this.handleInteractionMove({ clientX, clientY });
  }

  public handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.handleInteractionMove(event.touches[0]);
    }
  }

  public handleMouseUp(event: MouseEvent) {
    this.handleInteractionEnd();
  }

  public handleTouchEnd(event: TouchEvent) {
    this.handleInteractionEnd();
  }

  private handleInteractionMove({ clientX, clientY }: Point) {
    this.block.move(clientX - this.offsetX, clientY - this.offsetY);
  }

  private handleInteractionEnd() {
    this.board.states.pop();
  }
}

export class BoardStates {
  constructor(private readonly board: PuzzleBoard) {}

  private states: State[] = [new IdleState(this.board)];

  public push(state: State, args?: any) {
    this.current?.exit(args);
    this.states.push(state);
    this.current?.enter(args);
  }

  public pop(args?: any) {
    this.current?.exit(args);
    this.states.pop();
    this.current?.enter(args);
  }

  public get current() {
    return this.states.at(-1) ?? null;
  }
}
