export interface MessageAttributes {
  id: number;
  userId: number;
  serverId: number;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}