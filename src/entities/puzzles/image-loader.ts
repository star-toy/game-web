export class ImageLoader {
  private image: HTMLImageElement = new Image();

  public async loadImage(source: string) {
    const image = new Image();

    return new Promise<HTMLImageElement>((resolve) => {
      image.onload = () => {
        resolve(image);
      };

      image.src = source;
    });
  }
}
