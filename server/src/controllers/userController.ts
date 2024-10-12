// User Controller
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "@orm/models";

export async function registerUser(req: Request, res: Response) {
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