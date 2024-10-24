"use client";

import { useEffect, useRef, useState } from "react";

import { useClientWidthHeight } from "@/src/shared/hooks/use-client-width-height";

import { PuzzleBoard } from "@/src/entities/puzzles/puzzle-board";
import { ImageLoader } from "@/src/entities/puzzles/image-loader";

import { MOCK_IMAGE_URL, MOCK_PIECES } from "@/src/shared/constants";

const ChannelPage = ({
  params: { channelId },
}: {
  params: { channelId: string };
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [board, setBoard] = useState<null | PuzzleBoard>(null);

  const { width, height } = useClientWidthHeight(containerRef);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const devicePixelRatio = window.devicePixelRatio ?? 1;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        canvas.width = Math.floor(width * devicePixelRatio);
        canvas.height = Math.floor(height * devicePixelRatio);

        ctx.scale(devicePixelRatio, devicePixelRatio);
      }
    }
  }, [width, height]);

  useEffect(() => {
    (async () => {
      const imageUrl = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(MOCK_IMAGE_URL);
        }, 1000)
      );

      const image = await new ImageLoader().loadImage(imageUrl as string);

      const ctx = canvasRef.current?.getContext("2d");

      if (ctx) {
        const board = new PuzzleBoard(image, ctx);

        setBoard(board);

        board.initializeBlocks(MOCK_PIECES);

        let requestId: number;
        const requestAnimation = () => {
          requestId = window.requestAnimationFrame(requestAnimation);

          board.render();
        };

        requestAnimation();

        return () => {
          window.cancelAnimationFrame(requestId);
        };
      }
    })();
  }, [channelId]);

  useEffect(() => {
    if (!canvasRef.current || !board) return;

    canvasRef.current.addEventListener("mousedown", board.handleMouseDown);
    canvasRef.current.addEventListener("mousemove", board.handleMouseMove);
    canvasRef.current.addEventListener("mouseup", board.handleMouseUp);

    canvasRef.current.addEventListener("touchstart", board.handleTouchStart);
    canvasRef.current.addEventListener("touchmove", board.handleTouchMove);
    canvasRef.current.addEventListener("touchend", board.handleTouchEnd);

    return () => {
      canvasRef.current!.removeEventListener(
        "mousedown",
        board.handleMouseDown
      );
      canvasRef.current!.removeEventListener(
        "mousemove",
        board.handleMouseMove
      );
      canvasRef.current!.removeEventListener("mouseup", board.handleMouseUp);

      canvasRef.current!.removeEventListener(
        "touchstart",
        board.handleTouchStart
      );
      canvasRef.current!.removeEventListener(
        "touchmove",
        board.handleTouchMove
      );
      canvasRef.current!.removeEventListener("touchend", board.handleTouchEnd);
    };
  }, [canvasRef.current, board]);

  useEffect(() => {
    board?.handleAudioPermission();
  }, [board]);

  return (
    <section ref={containerRef} className="flex w-full h-screen">
      <canvas ref={canvasRef} />
    </section>
  );
};

export default ChannelPage;
