import { PuzzleBlock } from "./puzzle-block";
import { PuzzleBoard } from "./puzzle-board";

export class BoardMagnets {
  constructor(private readonly board: PuzzleBoard) {}

  public snap(block: PuzzleBlock) {
    // TODO: block 중에서 자신과 row 또는 column 이 1 차이나는 블록을 찾는다. (향후에 BlockGroup이 생겼을 때는 그에 맞는 처리 필요)
    const nearbyBlocks = this.board.findNearby(block);

    // TODO: 찾은 블록과 자신의 위치가 Threshold 이내인 Block을 찾는다.

    // TODO: 찾은 Block이 없으면 자신의 위치를 그대로 둔다.
    // TODO: 찾은 Block이 있다면 자신으로부터 가장 가까운 Block에 대하여 가장 가까운 쪽으로 붙인다.
    // TODO: 사운드를 실행한다.
  }
}
