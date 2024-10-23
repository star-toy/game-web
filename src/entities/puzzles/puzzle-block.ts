type CanvasDrawImageParams = Parameters<
  CanvasRenderingContext2D["drawImage"]
> extends [CanvasImageSource, ...infer Rest]
  ? Rest
  : never;

export class PuzzleBlock {
  private originX = 0;
  private originY = 0;

  constructor(
    private readonly subX: number,
    private readonly subY: number,
    private readonly width: number,
    private readonly height: number,
    private x: number,
    private y: number
  ) {}

  get area(): CanvasDrawImageParams {
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

  public includes(x: number, y: number) {
    return (
      this.x <= x &&
      this.x + this.width >= x &&
      this.y <= y &&
      this.y + this.height >= y
    );
  }

  public move(x: number, y: number) {
    this.x += x - this.x - this.originX;
    this.y += y - this.y - this.originY;
  }

  public setOrigin(x: number, y: number) {
    this.originX = x - this.x;
    this.originY = y - this.y;
  }

  public resetOrigin() {
    this.originX = 0;
    this.originY = 0;
  }
}
