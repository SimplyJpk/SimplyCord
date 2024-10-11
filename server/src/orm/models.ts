import User from './models/user';
import Message from './models/message';
import Server from './models/server';

const models = {
  User,
  Message,
  Server,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;