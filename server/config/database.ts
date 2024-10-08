import { Sequelize } from 'sequelize';

const sequelizeInstance = new Sequelize(
  process.env.DATABASE_NAME || 'default_db_name',
  process.env.DATABASE_USER || 'default_user',
  process.env.DATABASE_PASSWORD || 'default_password',
  {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql'
});

export default sequelizeInstance;