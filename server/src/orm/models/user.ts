import {
  DataTypes,
  Model,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import sequelizeInstance from '../../config/database';

import { UserAttributes } from '@shared/models/user';
import { v4 as uuidv4 } from 'uuid';
import UserProfilePicture from './userProfilePicture';

export interface ServerUserAttributes extends UserAttributes {
  // id: number;
  // username: string;
  email: string;
  password: string;
  salt: string;
  nonce: string;
  passwordChanged: Date;
  reset: number;
  // createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class User extends Model implements UserAttributes {
  public id!: CreationOptional<number>;
  public gid!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public salt!: string;
  public nonce!: string;
  public passwordChanged!: Date;
  public reset!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static associate(models: any) {
    User.hasMany(models.Message, { foreignKey: 'userId' });
    User.hasMany(models.ServerUsers, { foreignKey: 'userId' });
    User.hasOne(models.UserProfilePicture, { foreignKey: 'userId' });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    gid: {
      type: DataTypes.STRING,
      // Allowed, but is enforced by the hook
      allowNull: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nonce: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordChanged: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reset: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'users',
    modelName: 'User',
    paranoid: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (!user.gid) {
          user.gid = uuidv4();
        }
      }
    }
  }
);

export default User;