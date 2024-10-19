import { ServerChannelAttributes } from './serverChannel';

export interface ServerAttributes {
  id: number;
  gid: string;
  name: string;
  description: string;
  iconUrl: string;
  bannerUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  // Possible from /servers
  memberCount?: number;

  // Association of serverChannels
  channels?: ServerChannelAttributes[];
}