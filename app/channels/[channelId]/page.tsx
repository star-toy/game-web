"use client";

import { useEffect, useRef } from "react";

import CanvasContainer from "@/src/shared/components/canvas-container";
import PuzzleBoard from "@/src/entities/puzzle/puzzle-board";

const ChannelPage = ({
  params: { channelId },
}: {
  params: { channelId: string };
}) => {
  const boardRef = useRef<PuzzleBoard>(new PuzzleBoard());

  useEffect(() => {
    boardRef.current.fetch(channelId);
  }, [channelId]);

  return (
    <section className="flex w-full h-screen">
      <CanvasContainer board={boardRef.current} />
    </section>
  );
};

export default ChannelPage;
