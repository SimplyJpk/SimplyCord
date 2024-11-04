import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';

import dotenv from 'dotenv';

// Models
import models from '../orm/models';

dotenv.config();

const sequelizeInstance = new Sequelize({
  dialect: MySqlDialect,
  database: process.env.DB_NAME,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  benchmark: true,
  logging: (sql, timing) => {
    const message = `Executing (ms): ${timing}, SQL: ${sql}`;
    console.log(message);
  },
});

async function initializeDatabase() {
  try {
    await sequelizeInstance.authenticate();
    console.log('Connection has been established successfully.');

    // Drop all existing tables and start fresh
    await sequelizeInstance.queryInterface.dropTable(process.env.DB_NAME!);
    console.log('Dropped all tables');

    // Synchronize all models
    await sequelizeInstance.sync({ force: true });
    console.log('Forced database synced');

    const transaction = await sequelizeInstance.transaction(async () => {
      console.log('Started transaction');

      const user = await models.User.create({
        username: 'testuser',
        gid: 'testuser',
        email: 'testuser@test.com',
        password: 'testpassword',
        salt: 'test',
        nonce: 'test',
        passwordChanged: new Date(),
        reset: 0,
      });
      await models.UserProfilePicture.create({
        userId: user.id,
        url: 'profile.png',
      });
      console.log('Created user');

      if (process.env.TEST_USER) {
        const testUser = process.env.TEST_USER.replace(/\s/g, '').replace(/'/g, '').split(',');
        const improvUser = await models.User.create({
          username: testUser[1],
          gid: testUser[0],
          email: testUser[2],
          password: testUser[3],
          salt: testUser[4],
          nonce: testUser[5],
          passwordChanged: new Date(),
          reset: 0,
        });
        await models.UserProfilePicture.create({
          userId: improvUser.id,
          url: 'profile.webp',
        });
        console.log('Created test user');
      }

      const server1 = await models.Server.create({
        name: 'Unity Developer Community',
        gid: 'server1',
        description: 'First of its kind',
        iconUrl: 'profile.png',
        bannerUrl: 'banner.webp',
      });
      console.log('Created server 1');

      const server2 = await models.Server.create({
        name: 'Server 2',
        gid: 'server2',
        description: 'This is the second server',
        iconUrl: 'profile.png',
        bannerUrl: 'banner.webp',
      });
      console.log('Created server 2');

      const server3 = await models.Server.create({
        name: 'Server 3',
        gid: 'server3',
        description: 'This is the third server',
        iconUrl: 'profile.png',
        bannerUrl: 'banner.webp',
      });

      console.log('Created server 3');

      const servers = [server1, server2, server3];
      for (const server of servers) {
        for (let i = 0; i < randomInt(1, 2); i++) {
          await models.Message.create({
            message: `Message ${i + 1}`,
            userId: user.id,
            serverId: server.id,
            createdAt: new Date().toISOString(),
          });
        }
      }

    });
    console.log('Transaction committed');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
}

initializeDatabase();

export default sequelizeInstance;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}