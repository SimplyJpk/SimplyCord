import { Server as WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface Client {
  ws: WebSocket;
  lastPing: number;
  userId: string;
}

class WebSocketManager {
  private clients: Map<string, Client> = new Map();
  private wss: WebSocketServer;

  constructor(server: WebSocketServer) {
    this.wss = server;
    this.setupConnection();
    this.setupHeartbeat();
  }

  private setupConnection() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('New connection attempt');
      const urlParams = new URLSearchParams(req.url?.split('?')[1]);
      const token = urlParams.get('token');

      if (!token) {
        console.log('No token provided, closing connection');
        ws.close();
        return;
      }

      let userId: string = '';
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          ws.close(1008, 'Server configuration error');
          return;
        }
        const decoded = jwt.verify(token, jwtSecret);
        userId = (decoded as JwtPayload).id;
        if (!userId) {
          ws.close(1008, 'Invalid token');
          return;
        }

        console.log('WebSocket connection established with:', userId);
      } catch (err) {
        ws.close(1008, 'Invalid token');
        return;
      }

      // Check for existing connection and close it
      this.clients.forEach((client, clientId) => {
        if (client.userId === userId) {
          console.log(`Closing existing connection for user: ${userId}`);
          client.ws.close(1000, 'Duplicate connection');
          this.clients.delete(clientId);
        }
      });

      const clientId = this.generateClientId();
      this.clients.set(clientId, {
        ws,
        lastPing: Date.now(),
        userId
      });

      console.log(`New client connected: ${clientId}`);
      console.log(`Total clients: ${this.clients.size}`);

      ws.on('message', (message) => {
        const messageStr = message.toString();
        const { type } = JSON.parse(messageStr);
        if (type === 'alive') {
          const client = this.clients.get(clientId);
          if (client) {
            client.lastPing = Date.now();
            console.log(`Client ${clientId} is alive`);
          }
          return;
        }
        console.log(`Received message from ${clientId} => ${messageStr}`);
        this.broadcast(messageStr, clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error from ${clientId}:`, error);
      });

      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });
    });
  }

  private setupHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      this.clients.forEach((client, clientId) => {
        // 60 Seconds without ping from client is considered dead TODO: (James) Make configurable, maybe move into env or settings table
        if (now - client.lastPing > 60000) {
          console.log(`Client ${clientId} timed out`);
          client.ws.terminate();
          this.clients.delete(clientId);
        }
      });
    }, 20000); // 20 Second Heartbeat TODO: (James) Make configurable, maybe move into env or settings table
  }

  private broadcast(message: string, senderId: string) {
    this.clients.forEach((client, clientId) => {
      if (clientId !== senderId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

export default WebSocketManager;