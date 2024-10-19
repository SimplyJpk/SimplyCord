import { fn, col, literal } from '@sequelize/core';
// Server Controller
import { Request, Response } from 'express';
import { Server, User, ServerUsers, Message } from '@orm/models';
import { ServerAttributes } from '@shared/models/server';

import { ServerUsersAttributes } from '@shared/models/serverUsers';
import { websocketManager } from 'index';

export async function getPublicServers(req: Request, res: Response) {
  try {
    const servers = await Server.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'iconUrl',
        'bannerUrl',
        'createdAt',
      ],
    });

    // TODO: (James) Optimise this? Better yet, Redis cache this
    let serverInfo: ServerAttributes[] = [];
    for (const server of servers) {
      const memberCount = await ServerUsers.count({ where: { serverId: server.id } });
      serverInfo.push({ ...server.dataValues, memberCount });
    }

    res.json(serverInfo);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getServerChannels(req: Request, res: Response) {
  try {
    const { serverId } = req.params;
    const channels = await Server.findAll({ where: { serverId } });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getServerUsers(req: Request, res: Response) {
  try {
    const { serverId } = req.params;

    const users = await ServerUsers.findAll({
      where: { serverId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
      attributes: ['id', 'userId', 'joinDate'],
    });

    const reducedUsers = users.map((user: ServerUsersAttributes) => {
      return {
        id: user.id,
        joinDate: user.joinDate,
        username: user.user?.username,
      };
    });

    res.json(reducedUsers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function joinServer(req: Request, res: Response) {
  try {
    const { serverId } = req.params;
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    if (!serverId) {
      return res.status(400).json({ error: 'Invalid server' });
    }
    // Find User
    const user = await User.findOne({ where: { id: req.user?.id } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Find Server
    // TODO: (James) Confirm server is public
    const server = await Server.findOne({ where: { id: serverId } });
    if (!server) {
      return res.status(401).json({ error: 'Invalid server' });
    }

    // Confirm user isn't already in the server
    const serverUser = await ServerUsers.findOne({ where: { serverId, userId: user.id } });
    if (serverUser) {
      // Leave
      await ServerUsers.destroy({ where: { serverId, userId: user.id } });
      return res.json({ server: server.dataValues, success: true });
    } else {
      // Join
      await ServerUsers.create({ serverId, userId: user.id });
      return res.json({ server: server.dataValues, success: true });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getServerMessages(req: Request, res: Response) {
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
}