"use client";

import { useRef } from "react";

import { useClientWidthHeight } from "@/src/shared/hooks/use-client-width-height";

const ChannelPage = ({
  params: { channelId },
}: {
  params: { channelId: string };
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useClientWidthHeight(containerRef);

  return (
    <section ref={containerRef} className="flex w-full h-screen">
      <canvas />
    </section>
  );
};

export default ChannelPage;
