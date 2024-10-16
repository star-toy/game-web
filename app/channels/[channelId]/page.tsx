"use client";

import CanvasContainer from "@/src/shared/components/canvas-container";

const ChannelPage = ({ params }: { params: { channelId: string } }) => {
  return (
    <section className="flex h-screen">
      <CanvasContainer />
    </section>
  );
};

export default ChannelPage;
