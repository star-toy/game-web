type CanvasDrawImageParams = Parameters<
  CanvasRenderingContext2D["drawImage"]
> extends [CanvasImageSource, ...infer Rest]
  ? Rest
  : never;

export type EdgeType = "top" | "bottom" | "left" | "right";

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

  public getNearestEdgeCenter(otherBlock: PuzzleBlock): [number, number] {
    const distanceToTop = Math.abs(this.y - (otherBlock.y + otherBlock.height));
    const distanceToBottom = Math.abs(this.y + this.height - otherBlock.y);
    const distanceToLeft = Math.abs(this.x - (otherBlock.x + otherBlock.width));
    const distanceToRight = Math.abs(this.x + this.width - otherBlock.x);

    const minDistance = Math.min(
      distanceToTop,
      distanceToBottom,
      distanceToLeft,
      distanceToRight
    );

    switch (minDistance) {
      case distanceToTop:
        return [this.x + this.width / 2, this.y];
      case distanceToBottom:
        return [this.x + this.width / 2, this.y + this.height];
      case distanceToLeft:
        return [this.x, this.y + this.height / 2];
      default:
        return [this.x + this.width, this.y + this.height / 2];
    }
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
