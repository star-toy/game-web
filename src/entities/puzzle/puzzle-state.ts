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

abstract class State {
  constructor(protected readonly board: PuzzleBoard) {}

  public abstract enter(args?: any): void;
  public abstract exit(args?: any): void;

  public abstract handleMouseDown(event: MouseEvent): void;
  public abstract handleMouseMove(event: MouseEvent): void;
  public abstract handleMouseUp(event: MouseEvent): void;
}

class IdleState extends State {
  public enter(args: any) {}

  public exit(args: any) {}

  public handleMouseDown(event: MouseEvent) {}

  public handleMouseMove(event: MouseEvent) {}

  public handleMouseUp(event: MouseEvent) {}
}

export { BoardStates, IdleState };
