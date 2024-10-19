"use client";

import { useEffect, useRef } from "react";

import CanvasContainer from "@/src/shared/components/canvas-container";
import PuzzleBoard from "@/src/entities/puzzle/puzzle-board";
import { ImageBlock } from "@/src/entities/puzzle/puzzle-block";

const ChannelPage = ({ params }: { params: { channelId: string } }) => {
  const boardRef = useRef<PuzzleBoard>(new PuzzleBoard());

  useEffect(() => {
    boardRef.current.subscribe(
      new ImageBlock(
        0,
        0,
        0,
        0,
        "https://image.aladin.co.kr/product/5592/81/cover500/3581198452_1.jpg"
      )
    );
  }, []);

  return (
    <section className="flex w-full h-screen">
      <CanvasContainer board={boardRef.current} />
    </section>
  );
};

export default ChannelPage;
