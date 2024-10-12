// simple channel model
export interface ServerChannelAttributes {
  id: number;
  serverId: number;
  channelId: string;
  name: string;
  description: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}