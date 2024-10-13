// Secondary user component, which is passed a User model from the store
import { UserAttributes } from '@shared/models/user';
// Resources
import DefaultAvatar from '../../assets/icons/profile.png'

export default function UserSecondary({ user }: { user: UserAttributes }) {
  return (
    <div
      className="flex items-center gap-2 w-full cursor-pointer hover:bg-gray-900 overflow-hidden"
    >
      <img
        src={DefaultAvatar}
        alt="user-avatar"
        className="w-6 h-6 rounded-full hover:cursor-pointer hover:shadow-xl transition-all duration-500 flex-content-center"
      />
      <div className="flex flex-col">
        <span className="text-white font-bold hover:underline text-sm">
          {user?.username}</span>
        <span className={`text-xs ${user ? 'text-green-500' : 'text-red-500'}`}>
          {user ? 'Online?' : 'Offline?'}
        </span>
      </div>
    </div>
  );
}