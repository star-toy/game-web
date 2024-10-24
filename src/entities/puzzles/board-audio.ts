import { SNAP_SOUND_URL } from "@/src/shared/constants";
import { PuzzleBoard } from "./puzzle-board";

export class BoardAudio {
  private audioContext: null | AudioContext = null;

  constructor(private readonly board: PuzzleBoard) {}

  public handleAudioPermission = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
      this.audioContext = new AudioContext();
    });
  };

  public handleSnapSound = () => {
    const snapSound = new Audio(SNAP_SOUND_URL);
    snapSound.play();
  };
}
