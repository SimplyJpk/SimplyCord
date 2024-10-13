import { useDispatch } from 'react-redux';

import SettingsCog from '@icons/ui/iconmonstr-gear-6-240.png';
import DefaultAvatar from '@icons/profile.png'

import { UserAttributes } from '@shared/models/user';

import { logout } from '@slices/authSlice';
import { AppDispatch } from '@store/store';

export default function UserBar({
  user,
}: {
  user: UserAttributes;
}) {
  const dispatch: AppDispatch = useDispatch();


  return (
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
  );
}

