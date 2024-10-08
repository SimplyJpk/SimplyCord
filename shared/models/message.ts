// @shared/models/message.ts
export class Message {
  public id!: number;
  public userId!: number;
  public message!: string;
  public createdAt!: Date;

  constructor(id: number, userId: number, message: string, createdAt: Date) {
    this.id = id;
    this.userId = userId;
    this.message = message;
    this.createdAt = createdAt;
  }
}