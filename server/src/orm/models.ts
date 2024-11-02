// Models
import Message from './models/message';
import Server from './models/server';
import ServerChannel from './models/serverChannel';
import User from './models/user';
import ServerUsers from './models/serverUsers';
import UserProfilePicture from './models/userProfilePicture';

const models = {
  Message,
  Server,
  ServerChannel,
  User,
  ServerUsers,
  UserProfilePicture,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;

export {
  User,
  Message,
  Server,
  ServerChannel,
  ServerUsers,
  UserProfilePicture,
};