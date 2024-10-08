import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

import { Message } from '@shared/models/message';

export default class MessageModel extends Model implements Message {
  public id!: number;
  public userId!: number;
  public message!: string;
  public createdAt!: Date;

  public static associate(models: any) {
    MessageModel.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

MessageModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
    },
  },
  {
    sequelize,
    tableName: 'messages',
    modelName: 'Message',
    paranoid: true,
  },
);