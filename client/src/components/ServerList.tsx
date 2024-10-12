import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { ServerAttributes } from '@shared/models/server';
import DefaultAvatar from '../assets/icons/profile.png'

export default function ServerList({
  onServerSelect,
}) {
  const servers = useSelector((state: RootState) => state.servers.servers);

  return (
    <div className="w-20 h-screen bg-gray-900 text-white">
      <div className="flex flex-col gap-2 p-2">
        {servers.map((server: ServerAttributes, index) => (
          <div
            key={index}
            onClick={() => onServerSelect(servers[index])}
            className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm h-16 w-16 cursor-pointer hover:bg-gray-200"
          >
            <img
              src={server.icon || DefaultAvatar}
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
            <p className="text-black absolute">
              {server.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}