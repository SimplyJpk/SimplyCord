import { useDispatch } from 'react-redux';

import { ServerAttributes } from '@shared/models/server';
import { ServerChannelAttributes } from '@shared/models/serverChannel';

import { UserAttributes } from '@shared/models/user';

import { AppDispatch } from '../../../store/store';

// Components
import UserBar from './UserBar';

export default function ServerSideBar({
  server,
  user,
}: {
  server: ServerAttributes;
  user: UserAttributes;
}) {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="w-80 h-screen bg-gray-800 text-white relative border-r border-gray-700 overflow-hidden">
      <div className="flex items-center gap-2 h-12 w-full cursor-pointer hover:bg-gray-900 p-2">
        <h2 className="text-white px-4">{server?.name}</h2>
      </div>
      <div className="w-full h-1 bg-gray-500 opacity-50" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 h-12 w-full cursor-pointer hover:bg-gray-900 p-2">
          <h2 className="text-white px-4">Channels</h2>
        </div>
        <div className="flex flex-col gap-2 p-2">
          {server?.channels?.map((channel: ServerChannelAttributes, index) => (
            <div
              key={index}
              className="flex items-center gap-2 h-12 w-full cursor-pointer hover:bg-gray-900 p-2"
            >
              <h2 className="text-white px-4">{channel.name}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col absolute bottom-0">
        <UserBar user={user} />
      </div>
    </div>
  );
}