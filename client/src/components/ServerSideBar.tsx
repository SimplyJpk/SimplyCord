
import { ServerAttributes } from '@shared/models/server';
import { ServerChannelAttributes } from '@shared/models/serverChannel';

export default function ServerSideBar({
  server,
}: {
  server: ServerAttributes;
}) {
  return (
    <div className="w-80 h-screen bg-gray-800 text-white">
      <div
        className="flex items-center gap-2 h-12 w-full cursor-pointer hover:bg-gray-900 p-2"
      >
        <h2
          className="text-white px-4"
        >
          {server?.name}
        </h2>
      </div>
      <div className="w-full h-1 bg-gray-500 opacity-50" />
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center gap-2 h-12 w-full cursor-pointer hover:bg-gray-900 p-2"
        >
          <h2
            className="text-white px-4"
          >
            Channels ???
          </h2>
        </div>
        <div className="flex flex-col gap-2 p-2">
          {server?.channels?.map((channel: ServerChannelAttributes, index) => (
            <div
              key={index}
              className="flex items-center gap-2 h-12 w-full cursor-pointer hover:bg-gray-900 p-2"
            >
              <h2
                className="text-white px-4"
              >
                {channel.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}