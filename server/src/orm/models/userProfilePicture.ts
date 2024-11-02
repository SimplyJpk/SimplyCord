import {
  DataTypes,
  Model,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import sequelizeInstance from '../../config/database';

import { UserProfilePictureAttributes } from '@shared/models/userProfilePicture';

class UserProfilePicture extends Model implements UserProfilePictureAttributes {
  public id!: CreationOptional<number>;
  public userId!: number;
  public url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    UserProfilePicture.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

UserProfilePicture.init(
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'userProfilePictures',
    modelName: 'UserProfilePicture',
  }
);

export default UserProfilePicture;
