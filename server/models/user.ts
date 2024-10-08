

import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  salt: string;
  nonce: string;
  passwordChanged: Date;
  reset: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Define the creation attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'passwordChanged' | 'reset'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public salt!: string;
  public nonce!: string;
  public passwordChanged!: Date;
  public reset!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // Define the associations for the User model
  public static associate(models: any) {
    User.hasMany(models.Message, { foreignKey: 'userId' });
  }
}

// Initialize the User model
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
    sequelize,
    tableName: 'users',
    modelName: 'User',
    paranoid: true, // Enable paranoid mode to include deletedAt timestamp
  }
);

export default User;