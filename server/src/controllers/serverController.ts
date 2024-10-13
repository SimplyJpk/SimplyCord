// Server Controller
import { Request, Response } from 'express';
import { Server, User } from '@orm/models';

export async function getServers(req: Request, res: Response) {
  try {
    const servers = await Server.findAll();
    res.json(servers);
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
    const users = await User.findAll();
    const sanitizedUsers = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    });
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}