class Block {
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {}

  get position() {
    return [this.x, this.y, this.width, this.height] as const;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(...this.position);
  }

  public move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
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
      ctx.drawImage(this.image, ...this.position);
    }
  }
}

export { Block, ImageBlock };
