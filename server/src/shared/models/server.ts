import { ServerChannelAttributes } from './serverChannel';

export interface ServerAttributes {
  id: number;
  gid: string;
  name: string;
  description: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  channels?: ServerChannelAttributes[];
}