class Block {
  private originX = 0;
  private originY = 0;

  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {}

  get area() {
    return [this.x, this.y, this.width, this.height] as const;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(...this.area);
  }

  public move(x: number, y: number) {
    this.x += x - this.x - this.originX;
    this.y += y - this.y - this.originY;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public includes(x: number, y: number) {
    return (
      this.x <= x &&
      this.x + this.width >= x &&
      this.y <= y &&
      this.y + this.height >= y
    );
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

class ImageBlock extends Block {
  private image: null | HTMLImageElement = null;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    private readonly src: string
  ) {
    super(x, y, width, height);

    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.image = image;
      this.resize(image.width, image.height);
    };
  }

  async draw(ctx: CanvasRenderingContext2D) {
    if (this.image) {
      ctx.drawImage(this.image, ...this.area);
    }
  }
}

export { Block, ImageBlock };
