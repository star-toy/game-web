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

    this.listen();
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
  }

  private listen() {
    this.canvas.addEventListener("mousedown", (event) =>
      this.board.handleMouseDown(event)
    );
    this.canvas.addEventListener("mousemove", (event) =>
      this.board.handleMouseMove(event)
    );
    this.canvas.addEventListener("mouseup", (event) =>
      this.board.handleMouseUp(event)
    );
  }
}

export default CanvasService;
