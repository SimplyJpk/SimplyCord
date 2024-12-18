import {
  DataTypes,
  Model,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import sequelizeInstance from '../../config/database';

import { MessageAttributes } from '@shared/models/message';
import { v4 as uuidv4 } from 'uuid';

class Message extends Model implements MessageAttributes {
  public id!: CreationOptional<number>;
  public gid!: string;
  public userId!: number;
  public serverId!: number;
  public message!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static associate(models: any) {
    Message.belongsTo(models.User, { foreignKey: 'userId' });
    Message.belongsTo(models.Server, { foreignKey: 'serverId' });
  }
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    serverId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'messages',
    modelName: 'Message',
    paranoid: true,
    hooks: {
      beforeCreate: async (message: Message) => {
        if (!message.gid) {
          message.gid = uuidv4();
        }
      }
    },
  }
);

export default Message;