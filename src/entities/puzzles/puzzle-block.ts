type CanvasDrawImageParams = Parameters<
  CanvasRenderingContext2D["drawImage"]
> extends [CanvasImageSource, ...infer Rest]
  ? Rest
  : never;

export class PuzzleBlock {
  constructor(
    private readonly row: number,
    private readonly column: number,
    private readonly subX: number,
    private readonly subY: number,
    private readonly width: number,
    private readonly height: number,
    private x: number,
    private y: number
  ) {}

  get gridIndices() {
    return { row: this.row, column: this.column };
  }

  get dimensions() {
    return { width: this.width, height: this.height };
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  get bounds(): CanvasDrawImageParams {
    return [
      this.subX,
      this.subY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    ] as const;
  }

  get edgeCenters() {
    return {
      top: [this.x + this.width / 2, this.y],
      bottom: [this.x + this.width / 2, this.y + this.height],
      left: [this.x, this.y + this.height / 2],
      right: [this.x + this.width, this.y + this.height / 2],
    } as const;
  }

  public includes(x: number, y: number) {
    return (
      this.x <= x &&
      this.x + this.width >= x &&
      this.y <= y &&
      this.y + this.height >= y
    );
  }

  public move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
