import express from 'express';
import multer from 'multer';
import {
  registerUser,
  loginUser,
  getUser,
  getUserProfilePicture
} from '@controllers/userController';
import { User, ServerUsers, UserProfilePicture } from '@orm/models';
import { UserAttributes } from '@shared/models/user';
import { ServerUsersAttributes } from '@shared/models/serverUsers';
import { authenticateToken } from '../middleware/authenticateToken';
import { Op } from '@sequelize/core';

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.TEMP_UPLOADS_PATH || 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 100 * 1024 }, // 100kb limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// TODO: (James) Maybe move behind auth to avoid potential abuse?
router.post('/register', upload.single('file'), async (req, res) => {
  try {
    const profilePicture = req.file ? req.file.path : null;
    await registerUser(req, res, profilePicture);
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

router.get('/profile-picture/:userId', async (req, res) => {
  try {
    await getUserProfilePicture(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

export default router;