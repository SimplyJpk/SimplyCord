import express from 'express';

import { registerUser, loginUser } from '@controllers/userController';

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

export default router;