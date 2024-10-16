import { Board } from "./puzzle-board";

class CanvasService {
  private ctx: CanvasRenderingContext2D;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly board: Board
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
  }
}

export default CanvasService;
