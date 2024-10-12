import {
  DataTypes,
  Model,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import sequelizeInstance from '../../config/database';

import { UserAttributes } from '@shared/models/user';

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
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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
  }
);

export default User;