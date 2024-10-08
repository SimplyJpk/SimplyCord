// Simple message component, which is passed a Message model from the store
import { Message as MessageModel } from '@shared/models/message';

export default function Message({ message }: { message: MessageModel }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm">
      <div className="flex-shrink-0">
        <img
          src={message.avatar ?? '/src/assets/icons/profile.png'} alt="avatar" className="w-14 h-14 rounded-full" />
      </div>
      <div className="ml-3">
        <p className="text-gray-900">{message.message}</p>
        <p className="text-gray-500">{message.createdAt?.toLocaleString()}</p>
      </div>
    </div>
  );
}