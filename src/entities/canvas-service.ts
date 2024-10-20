import PuzzleBoard from "./puzzle/puzzle-board";

class CanvasService {
  private ctx: CanvasRenderingContext2D;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly board: PuzzleBoard
  ) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    this.ctx = ctx;
  }

  public render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.board.draw(this.ctx);
  }

  public resize(width: number, height: number) {
    const devicePixelRatio = window.devicePixelRatio ?? 1;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.canvas.width = Math.floor(width * devicePixelRatio);
    this.canvas.height = Math.floor(height * devicePixelRatio);

    this.ctx.scale(devicePixelRatio, devicePixelRatio);

    this.board.resize(this.canvas.width, this.canvas.height);
  }

  public attach() {
    this.canvas.addEventListener("mousedown", this.board.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.board.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.board.handleMouseUp);

    this.canvas.addEventListener("touchstart", this.board.handleTouchStart);
    this.canvas.addEventListener("touchmove", this.board.handleTouchMove);
    this.canvas.addEventListener("touchend", this.board.handleTouchEnd);
  }

  public detach() {
    this.canvas.removeEventListener("mousedown", this.board.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.board.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.board.handleMouseUp);

    this.canvas.removeEventListener("touchstart", this.board.handleTouchStart);
    this.canvas.removeEventListener("touchmove", this.board.handleTouchMove);
    this.canvas.removeEventListener("touchend", this.board.handleTouchEnd);
  }
}

export default CanvasService;
