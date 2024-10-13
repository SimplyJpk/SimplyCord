import { useDispatch } from 'react-redux';

import { ServerAttributes } from '@shared/models/server';
import { ServerChannelAttributes } from '@shared/models/serverChannel';

import SettingsCog from '../assets/icons/ui/iconmonstr-gear-6-240.png';
import DefaultAvatar from '../assets/icons/profile.png'

import { UserAttributes } from '@shared/models/user';

import { logout } from '../slices/authSlice';
import { AppDispatch } from '../store/store';

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
        <div className="h-12 flex flex-grow bg-gray-900 text-sm">
          <div className="flex w-full items-center gap-2 p-3">
            <img
              src={DefaultAvatar}
              alt="user-avatar"
              // glow on hover
              className="w-8 h-8 rounded-full hover:cursor-pointer hover:shadow-xl transition-all duration-500"
            />
            <div className="flex flex-col">
              <span className="text-white">{user?.username}</span>
              <span className={`text-xs ${user ? 'text-green-500' : 'text-red-500'}`}>
                {user ? 'Online' : 'Offline'}
              </span>
            </div>
            <img
              src={SettingsCog}
              alt="settings-cog"
              // rotate on hover, get darker
              className="w-6 h-6 invert ml-auto cursor-pointer hover:rotate-90 transition-all duration-500 hover:scale-125"
              onClick={() => dispatch(logout())}
            />
          </div>
        </div>
      </div>
    </div>
  );
}