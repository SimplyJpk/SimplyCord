import express from 'express';

import { registerUser, loginUser, getUser } from '@controllers/userController';

import { User, ServerUsers } from '@orm/models';
import { UserAttributes } from '@shared/models/user';
import { ServerUsersAttributes } from '@shared/models/serverUsers';

// Middleware
import { authenticateToken } from '../middleware/authenticateToken';
import { Op } from '@sequelize/core';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/me', authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    await getUser(req, res);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/server/order', authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    const serverIds = req.body;
    // select the ServerUsers that are from req.user and then update the order
    const serverUsersToUpdate = await ServerUsers.findAll({
      where: {
        userId: req.user?.id,
        serverId: {
          [Op.in]: serverIds
        },
      },
    });
    //sorted by the order of the serverIds
    serverUsersToUpdate.sort((a, b) => serverIds.indexOf(a.serverId) - serverIds.indexOf(b.serverId));

    if (serverUsersToUpdate.length === serverIds.length) {
      for (let i = 0; i < serverUsersToUpdate.length; i++) {
        serverUsersToUpdate[i].order = i;
        await serverUsersToUpdate[i].save();
      }
    }
    if (!res.headersSent) {
      res.json({ success: true });
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

export default router;