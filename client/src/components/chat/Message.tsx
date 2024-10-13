import { MessageAttributes } from '@shared/models/message';
// Utils
import { getMessageDate } from '@util/dateUtil'
// Resources
import DefaultAvatar from '@icons/profile.png'

export default function Message({ message }: { message: MessageAttributes }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-1 text-sm">
      <div className="flex-shrink-0">
        <img
          src={message.user?.avatar ?? DefaultAvatar}
          alt="avatar"
          className="w-14 h-14 rounded-full"
        />
      </div>
      <div className="ml-3">
        <div className="flex items-center gap-2">
          <span
            className="text-gray-900 
          font-bold hover:underline">
            {message.user?.username ?? message.userId}
          </span>
          <span
            className="text-gray-500">
            {message.createdAt ? getMessageDate(message.createdAt) : ''}
          </span>
        </div>
        <p className="text-gray-900">{message.message}</p>
      </div>
    </div>
  );
}