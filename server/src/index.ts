import './types/express/index.t';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelizeInstance from './config/database';

// Routes
import userRoutes from '@routes/userRoutes';
import serverRoutes from '@routes/serverRoutes';

// Controllers
// TODO: (James) Prob don't need to import these

// Models
import models from './orm/models';
const { User, Message, Server, ServerChannel } = models;

// Middleware
import { authenticateToken } from './middleware/authenticateToken';

const apiPrefix = '/api/v1';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get(`${apiPrefix}/`, (req, res) => {
  res.send('Hello World!');
});

app.use(`${apiPrefix}/user`, userRoutes);

app.use(`${apiPrefix}/servers`, serverRoutes);


app.get(`${apiPrefix}/messages`, authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    // just get all messages in database
    const messages = await Message.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get(`${apiPrefix}/messages/:serverId`, authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    const { serverId } = req.params;
    const messages = await Message.findAll({
      where: { serverId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post(`${apiPrefix}/messages/:serverId`, authenticateToken as express.RequestHandler, async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Invalid user' });
  }
  try {
    let { message } = req.body;
    const userId = req.user?.id;
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      // sanitize
      message = message.replace(/<.*?>/g, '');

      const serverIdInt = parseInt(req.params.serverId, 10);

      const messageObj = await Message.create({
        message,
        userId: user.id,
        serverId: serverIdInt,
        // createAt (UTC time)
        createdAt: new Date().toISOString(),
      });
      // TODO: (James) We don't want to destructure the user object, but we do want to return the username, and/or make user aware enough they handle it
      res.json({ ...messageObj.dataValues, user: { userId: user.id, username: user.username } });
    } else {
      res.status(401).json({ error: 'Invalid user' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post(`${apiPrefix}/servers/:serverId/channels`, authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    const { serverId } = req.params;
    const { channelId, name, description, icon } = req.body;

    const server = await Server.findOne({ where: { id: serverId } });
    if (server) {
      const channel = await ServerChannel.create({
        serverId,
        channelId,
        name,
        description,
        icon,
        createdAt: new Date().toISOString(),
      });
      res.json(channel);
    } else {
      res.status(401).json({ error: 'Invalid server' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`);
});

export default app;