const ChannelPage = ({ params }: { params: { channelId: string } }) => {
  return <section>{params.channelId}</section>;
};

export default ChannelPage;
