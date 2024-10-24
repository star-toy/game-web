import { SNAP_SOUND_URL } from "@/src/shared/constants";
import { PuzzleBlock } from "./puzzle-block";
import { PuzzleBoard } from "./puzzle-board";

type EdgeType = "top" | "bottom" | "left" | "right";

interface SnapInfo {
  block: PuzzleBlock;
  distance: number;
  edge1: EdgeType;
  edge2: EdgeType;
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
      {
        row: row - 1,
        column,
        edge1: "top",
        edge2: "bottom",
      },
      {
        row: row + 1,
        column,
        edge1: "bottom",
        edge2: "top",
      },
      {
        row,
        column: column - 1,
        edge1: "left",
        edge2: "right",
      },
      {
        row,
        column: column + 1,
        edge1: "right",
        edge2: "left",
      },
    ] as {
      row: number;
      column: number;
      edge1: EdgeType;
      edge2: EdgeType;
    }[];

    const snapTargets = potentialTargets
      .filter(({ row: r, column: c }) => {
        return !!this.board.getBlockByIndices(r, c);
      })
      .filter(({ row: r, column: c, edge1, edge2 }) => {
        return (
          this.calculateDistance(
            block.edgeCenters[edge1],
            this.board.getBlockByIndices(r, c)!.edgeCenters[edge2]
          ) <= this.threshold
        );
      })
      .map(({ row: r, column: c, edge1, edge2 }) => {
        const targetBlock = this.board.getBlockByIndices(r, c)!;

        return {
          block: targetBlock,
          distance: this.calculateDistance(
            block.edgeCenters[edge1],
            targetBlock.edgeCenters[edge2]
          ),
          edge1,
          edge2,
        };
      });

    return !snapTargets.length
      ? null
      : snapTargets.reduce((snapInfo1, snapInfo2) => {
          return snapInfo1.distance < snapInfo2.distance
            ? snapInfo1
            : snapInfo2;
        });
  }

  private adjustPosition(
    block: PuzzleBlock,
    { block: block2, edge2 }: SnapInfo
  ) {
    const { x: x2, y: y2 } = block2.position;
    const { width: width2, height: height2 } = block2.dimensions;

    switch (edge2) {
      case "left":
        block.move(x2 - block.dimensions.width, y2);
        break;
      case "right":
        block.move(x2 + width2, y2);
        break;
      case "top":
        block.move(x2, y2 - block.dimensions.height);
        break;
      case "bottom":
        block.move(x2, y2 + height2);
        break;
    }
  }

  private playSnapSound() {
    this.snapSound.play();
  }
}
