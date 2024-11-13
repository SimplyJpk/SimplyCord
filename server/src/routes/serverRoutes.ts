// Server Routes
import express from 'express';

import { authenticateToken } from '../middleware/authenticateToken';

import { Server, ServerChannel } from '@orm/models';
import { ServerAttributes } from '@shared/models/server';

import {
  getPublicServers,
  getServerChannels,
  getServerUsers,
  joinServer,
  getServerMessages,
} from '@controllers/serverController';

const router = express.Router();

router.get('/', authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    const servers = await getPublicServers(req, res);
    if (!res.headersSent) {
      res.json(servers);
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

router.get('/:serverId/channels', authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    const { serverId } = req.params;
    const channels = await getServerChannels(req, res);
    if (!res.headersSent) {
      res.json(channels);
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

router.get('/:serverId/messages', authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    const { serverId } = req.params;
    const messages = await getServerMessages(req, res);
    if (!res.headersSent) {
      res.json(messages);
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

router.get('/:serverId/users', authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    await getServerUsers(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

router.post('/:serverId/join', authenticateToken as express.RequestHandler, async (req, res) => {
  try {
    await joinServer(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

export default router;