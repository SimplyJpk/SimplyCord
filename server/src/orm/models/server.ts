import {
  DataTypes,
  Model,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import sequelizeInstance from '../../config/database';

import { ServerAttributes } from '@shared/models/server';
import { v4 as uuidv4 } from 'uuid';

class Server extends Model implements ServerAttributes {
  public id!: CreationOptional<number>;
  public gid!: string;
  public name!: string;
  public description!: string;
  public iconUrl!: string;
  public bannerUrl!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static associate(models: any) {
    Server.hasMany(models.Message, { foreignKey: 'serverId' });
    Server.hasMany(models.ServerUsers, { foreignKey: 'serverId' });
  }
}

Server.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    gid: {
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
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bannerUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'servers',
    modelName: 'Server',
    paranoid: true,
    hooks: {
      beforeCreate: async (server: Server) => {
        if (!server.gid) {
          server.gid = uuidv4();
        }
      }
    }
  }
);

export default Server;