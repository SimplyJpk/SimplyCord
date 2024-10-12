import {
  DataTypes,
  Model,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import sequelizeInstance from '../../config/database';

import { ServerChannelAttributes } from '@shared/models/serverChannel';

class ServerChannel extends Model implements ServerChannelAttributes {
  public id!: CreationOptional<number>;
  public serverId!: number;
  public channelId!: string;
  public name!: string;
  public description!: string;
  public icon!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static associate(models: any) {
    ServerChannel.belongsTo(models.Server, { foreignKey: 'serverId' });
  }
}

ServerChannel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    serverId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'serverChannels',
    modelName: 'ServerChannel',
    paranoid: true,
  }
);

export default ServerChannel;