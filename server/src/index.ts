import './types/express/index.t';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import WebSocket from 'ws';
import WebSocketManager from './websocket/websocketManager';
import { createWriteStream, createReadStream } from 'fs';
import { get } from 'https';
import { exec } from 'child_process';
import * as path from 'path';
import * as unzipper from 'unzipper';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelizeInstance from './config/database';

// Routes
import userRoutes from '@routes/userRoutes';
import serverRoutes from '@routes/serverRoutes';

// Controllers
// TODO: (James) Prob don't need to import these

// Check if UPLOADS_PATH, TEMP_UPLOADS_PATH and PROFILE_PICTURES_PATH exists and create them if not
if (!fs.existsSync(process.env.UPLOADS_PATH!)) {
  fs.mkdirSync(process.env.UPLOADS_PATH!, { recursive: true });
}
if (!fs.existsSync(process.env.TEMP_UPLOADS_PATH!)) {
  fs.mkdirSync(process.env.TEMP_UPLOADS_PATH!, { recursive: true });
}
if (!fs.existsSync(process.env.PROFILE_PICTURES_PATH!)) {
  fs.mkdirSync(process.env.PROFILE_PICTURES_PATH!, { recursive: true });
}

if (!fs.existsSync(process.env.SERVER_DATA_PATH!)) {
  fs.mkdirSync(process.env.SERVER_DATA_PATH!, { recursive: true });
}

if (!fs.existsSync(process.env.PUBLIC_DIR!)) {
  fs.mkdirSync(process.env.PUBLIC_DIR!, { recursive: true });
}

// Download Test Media process.env.TEST_DOWNLOAD_MEDIA
if (process.env.TEST_DOWNLOAD_MEDIA) {
  const downloadUrl = process.env.TEST_DOWNLOAD_MEDIA;
  const filePath = path.join(__dirname, '../temp.zip');
  const outputDir = path.join(__dirname, '../');

  console.log('TEST_DOWNLOAD_MEDIA:', downloadUrl);
  console.log('TEST_DOWNLOAD_MEDIA_OUTPUT:', outputDir);
  console.log('Downloading file from:', downloadUrl);

  // Bypass SSL certificate verification
  const originalTlsRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  get(downloadUrl, (response) => {
    response.pipe(createWriteStream(filePath));
    response.on('end', async () => {
      console.log('Download complete');
      try {
        await createReadStream(filePath)
          .pipe(unzipper.Extract({ path: outputDir }))
          .promise();
        console.log('Unzip complete');
        // print out the files in the output directory
        const files = await fs.readdirSync(outputDir);
        console.log('Files in output directory:', files);
      } catch (error) {
        console.error(`Unzip error: ${error}`);
      } finally {
        // Reset the NODE_TLS_REJECT_UNAUTHORIZED to its original value
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsRejectUnauthorized;
      }
    });
  }).on('error', (err) => {
    // Reset the NODE_TLS_REJECT_UNAUTHORIZED to its original value
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsRejectUnauthorized;
    console.error(`Download error: ${err.message}`);
  });
}


// Models
import models from './orm/models';
const { User, Message, Server, ServerChannel } = models;

// Middleware
import { authenticateToken } from './middleware/authenticateToken';

const apiPrefix = '/api/v1';

dotenv.config();

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const websocketManager = new WebSocketManager(wss);
export { websocketManager };

//
app.use(express.json());
app.use(cors({
  origin: process.env.SERVER_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true
}));

app.get(`${apiPrefix}/`, (req, res) => {
  res.send('Hello World!');
});

app.use(`${apiPrefix}/user`, userRoutes);

app.use(`${apiPrefix}/servers`, serverRoutes);

// Define the regex pattern for allowed files
const allowedFilePattern = /^(icon|profile)\..*$/;

// Middleware to check file name against the regex pattern
const fileFilterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const fileName = path.basename(req.path);
  const allowedFilePattern = /^(icon|profile|banner)\.[a-zA-Z0-9]+$/; // Adjust the pattern to allow icon, profile, and banner files with any extension
  if (allowedFilePattern.test(fileName)) {
    next();
  } else {
    res.status(403).json({ error: 'Access to this file is forbidden' });
  }
};

app.use('/static', fileFilterMiddleware, express.static(path.join(__dirname, '../uploads/public'), {
  maxAge: '1d',
  setHeaders: (res, path, stat) => {
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('Content-Type', 'application/octet-stream');
  }
}));

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
      console.log('Message created:', user);
      res.json({ ...messageObj.dataValues, user: { id: user.id, username: user.username } });
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

server.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`);
});


export default app;