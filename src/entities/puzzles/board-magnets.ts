import { SNAP_SOUND_URL } from "@/src/shared/constants";
import { EdgeType, PuzzleBlock } from "./puzzle-block";
import { PuzzleBoard } from "./puzzle-board";

interface SnapInfo {
  block: PuzzleBlock;
  distance: number;
  sourcePoint: [number, number];
  targetPoint: [number, number];
}

export class BoardMagnets {
  private readonly threshold = Math.pow(6, 2);
  private readonly snapSound = new Audio(SNAP_SOUND_URL);

  constructor(private readonly board: PuzzleBoard) {}

  public snap(block: PuzzleBlock) {
    const snapInfo = this.findSnapTarget(block);

    if (snapInfo?.distance) {
      this.adjustPosition(block, snapInfo);
      this.playSnapSound();
    }
  }

  private calculateDistance(
    [x1, y1]: readonly [number, number],
    [x2, y2]: readonly [number, number]
  ) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  private findSnapTarget(block: PuzzleBlock) {
    return this.getPotentialTargets(block).reduce<null | SnapInfo>(
      (closest, current) =>
        closest == null || current.distance < closest.distance
          ? current
          : closest,
      null as null | SnapInfo
    );
  }

  private getPotentialTargets(block: PuzzleBlock) {
    return this.board
      .findNearby(block)
      .map((targetBlock) => {
        const sourcePoint = block.getNearestEdgeCenter(targetBlock);
        const targetPoint = targetBlock.getNearestEdgeCenter(block);

        return {
          block,
          distance: this.calculateDistance(sourcePoint, targetPoint),
          sourcePoint,
          targetPoint,
        };
      })
      .filter(({ distance }) => distance <= this.threshold);
  }

  private adjustPosition(
    block: PuzzleBlock,
    { sourcePoint, targetPoint }: Pick<SnapInfo, "sourcePoint" | "targetPoint">
  ) {
    const dx = targetPoint[0] - sourcePoint[0];
    const dy = targetPoint[1] - sourcePoint[1];

    block.move(block.position.x + dx, block.position.y + dy);
  }

  private playSnapSound() {
    this.snapSound.play();
  }
}
