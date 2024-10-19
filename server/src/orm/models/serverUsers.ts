import {
  DataTypes,
  Model,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import sequelizeInstance from '../../config/database';

import { ServerUsersAttributes } from '@shared/models/serverUsers';

class ServerUsers extends Model implements ServerUsersAttributes {
  public id!: CreationOptional<number>;
  public serverId!: number;
  public userId!: number;
  public joinDate!: Date;

  public static associate(models: any) {
    ServerUsers.belongsTo(models.Server, { foreignKey: 'serverId' });
    ServerUsers.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

ServerUsers.init(
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'serverUsers',
    modelName: 'ServerUsers',
    paranoid: false,
    hooks: {
      beforeCreate: async (serverUser: ServerUsers) => {
        if (!serverUser.joinDate) {
          serverUser.joinDate = new Date();
        }
      }
    }
  }
);

export default ServerUsers;