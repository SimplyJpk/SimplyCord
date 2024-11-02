// User Controller
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from "@orm/models";
import { ServerUsers, Server, UserProfilePicture } from "@orm/models";

import { UserAttributes } from '@shared/models/user';
import { ServerUsersAttributes } from '@shared/models/serverUsers';

import fs from 'fs/promises';
import path from 'path';

export async function registerUser(req: Request, res: Response, profilePicturePath: string | null) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email already exists?
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Username already exists?
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password + salt, saltRounds);
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const hashedNonce = await bcrypt.hash(nonce, saltRounds);

  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      salt,
      nonce: hashedNonce,
      passwordChanged: new Date(),
      reset: 0
    });

    if (profilePicturePath && user) {
      // Copy the file to the profile pictures folder PROFILE_PICTURES_PATH
      // TODO: (James) Move this to a separate controller
      // Path is just relative + PROFILE_PICTURES_PATH + userId + profile.ext
      const profilePictureExt = path.extname(profilePicturePath);
      const newProfilePicturePath = `${process.env.PROFILE_PICTURES_PATH}/${user.id}/profile${profilePictureExt}`;
      await fs.mkdir(path.dirname(newProfilePicturePath), { recursive: true });
      await fs.copyFile(profilePicturePath, newProfilePicturePath);
      // Delete old file
      await fs.unlink(profilePicturePath);
      console.log('Copied file to profile pictures folder');
      const userProfilePicture = await UserProfilePicture.create({
        userId: user.id,
        url: newProfilePicturePath,
      });
      console.log('Created user profile picture');
    }

    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret');
      res.json({ token, userId: user.id, username: user.username });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password + user.salt, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret');
        res.json({ token, userId: user.id, username: user.username });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (userId) {
      const user = await User.findOne({
        where: { id: userId },
        // TODO: (James) Attribute scope limited to front-end related fields
        attributes: ['id', 'username', 'email'],
        include: [
          {
            model: ServerUsers,
            as: 'serverUsers',
            attributes: ['id', 'serverId', 'userId', 'joinDate', 'order'],
            include: [
              {
                model: Server,
                as: 'server',
                attributes: ['id', 'name', 'description', 'iconUrl', 'bannerUrl', 'createdAt'],
                required: false
              }
            ],
          },
          {
            model: UserProfilePicture,
            as: 'userProfilePicture',
            attributes: ['id', 'userId', 'url', 'createdAt', 'updatedAt'],
            required: false
          }
        ],
        order: [[{ model: ServerUsers, as: 'serverUsers' }, 'order', 'ASC']],
      });
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ error: 'Invalid user' });
      }
    } else {
      res.status(401).json({ error: 'Invalid user' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }

}

export async function getUserProfilePicture(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const userProfilePicture = await UserProfilePicture.findOne({ where: { userId } });

    if (userProfilePicture) {
      const filePath = userProfilePicture.url;
      res.sendFile(filePath, { root: '/' }, (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to send file' });
        }
      });
    } else {
      res.status(404).json({ error: 'Profile picture not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}