import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelize from './config/database';

// Models
import User from '@models/user';
import Message from '@models/message';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Error syncing database:', err);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

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
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const hashedPassword = await bcrypt.hash(password + user.salt, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10));
      if (await bcrypt.compare(hashedPassword, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret');
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/messages', async (req, res) => {
  try {
    // just get all messages in database
    const messages = await Message.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/messages', async (req, res) => {
  try {
    let { message, userId } = req.body;
    if (userId === undefined) {
      userId = 1;
    }
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      const messageObj = await Message.create({
        message,
        userId,
        createdAt: new Date()
      });
      res.json(messageObj);
    } else {
      res.status(401).json({ error: 'Invalid user' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`);
});

export default app;