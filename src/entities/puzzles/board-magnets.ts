import { SNAP_SOUND_URL } from "@/src/shared/constants";
import { PuzzleBlock } from "./puzzle-block";
import { PuzzleBoard } from "./puzzle-board";

type EdgeType = "top" | "bottom" | "left" | "right";

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
    const { row, column } = block.gridIndices;

    const potentialTargets = [
      { row: row - 1, column, sourceEdge: "top", targetEdge: "bottom" },
      { row: row + 1, column, sourceEdge: "bottom", targetEdge: "top" },
      { row, column: column - 1, sourceEdge: "left", targetEdge: "right" },
      { row, column: column + 1, sourceEdge: "right", targetEdge: "left" },
    ] as const;

    const snapTargets = potentialTargets
      .filter(({ row: r, column: c }) => {
        return !!this.board.getBlockByIndices(r, c);
      })
      .map(({ row: r, column: c, sourceEdge, targetEdge }) => {
        const targetBlock = this.board.getBlockByIndices(r, c)!;
        const sourcePoint = block.edgeCenters[sourceEdge];
        const targetPoint = targetBlock.edgeCenters[targetEdge];

        return {
          block: targetBlock,
          distance: this.calculateDistance(sourcePoint, targetPoint),
          sourcePoint,
          targetPoint,
        };
      })
      .filter(({ distance }) => distance <= this.threshold);

    return !snapTargets.length
      ? null
      : snapTargets.reduce((snapInfo1, snapInfo2) => {
          return snapInfo1.distance < snapInfo2.distance
            ? snapInfo1
            : snapInfo2;
        });
  }

  private adjustPosition(block: PuzzleBlock, snapInfo: SnapInfo) {
    const { sourcePoint, targetPoint } = snapInfo;
    const dx = targetPoint[0] - sourcePoint[0];
    const dy = targetPoint[1] - sourcePoint[1];

    block.move(block.position.x + dx, block.position.y + dy);
  }

  private playSnapSound() {
    this.snapSound.play();
  }
}
