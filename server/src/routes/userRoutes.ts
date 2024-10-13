import express from 'express';

import { registerUser, loginUser, getUser } from '@controllers/userController';

import { User } from '@orm/models';
import { UserAttributes } from '@shared/models/user';

// Middleware
import { authenticateToken } from '../middleware/authenticateToken';

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

export default router;