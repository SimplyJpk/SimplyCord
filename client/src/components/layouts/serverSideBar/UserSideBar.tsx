// SideBar that lives on the right side of the screen showing the users in the server
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { UserAttributes } from '@shared/models/user';
// Slices
import { selectCurrentServerId } from '../../../slices/app';
import { fetchServerUsers, selectSelectedServersUserList } from '../../../slices/serverSlice';
import { AppDispatch } from '../../../store/store';
// Resources
import DefaultAvatar from '../../../assets/icons/profile.png'
import SettingsCog from '../../../assets/icons/ui/iconmonstr-gear-6-240.png';
// Components
import UserSecondary from '../../user/UserSecondary';

export default function UserSideBar() {
  const dispatch: AppDispatch = useDispatch();

  // Selectors
  const currentServerId = useSelector(selectCurrentServerId);
  const selectedServersUserList = useSelector(selectSelectedServersUserList);

  // Effects
  useEffect(() => {
    if (currentServerId && selectedServersUserList.length === 0) {
      dispatch(fetchServerUsers(currentServerId));
    }
  }, [currentServerId, dispatch]);

  return (
    <div className="w-80 h-screen bg-gray-800 text-white relative border-r border-gray-700 overflow-hidden">
      <div className="flex items-center gap-2 h-12 w-full cursor-pointer hover:bg-gray-900 p-2">
        <h2 className="text-white px-4">Users</h2>
      </div>
      <div className="w-full h-1 bg-gray-500 opacity-50" />
      <div className="flex flex-col gap-2 px-2">
        {selectedServersUserList.map((user: UserAttributes, index) => (
          <UserSecondary key={index} user={user} />
        ))}
      </div>
    </div>
  );
}