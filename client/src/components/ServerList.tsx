import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { ServerAttributes } from '@shared/models/server';

import DefaultAvatar from '../assets/icons/profile.png'
import PlusCircle from '../assets/icons/ui/iconmonstr-plus-circle-lined-240.png'

export default function ServerList({
  onServerSelect,
}) {
  const servers = useSelector((state: RootState) => state.servers.servers);

  return (
    <div className="w-20 h-screen bg-gray-900 text-white relative">
      <div className="flex flex-col p-2 gap-2 overflow-y-auto flex-justify-end">
        {servers.map((server: ServerAttributes, index) => (
          <div
            key={index}
            onClick={() => onServerSelect(servers[index])}
            className="flex items-center justify-center gap-2 rounded-md border bg-white text-sm h-16 w-16 cursor-pointer hover:bg-gray-200"
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
        <div className="flex items-center justify-center rounded-md border text-sm h-16 w-16 cursor-pointer hover:bg-gray-200 absolute bottom-2 right-2">
          <img
            src={PlusCircle}
            alt="plus-circle"
            className="w-14 h-14 rounded-full bg-gray-5 align-middle cursor-pointer hover:bg-gray-6"
          />
        </div>
      </div>
    </div>
  );
}