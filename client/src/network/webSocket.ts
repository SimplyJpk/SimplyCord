class WebSocketClient {
  private ws: WebSocket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private url: string, private token: string) { }

  public connect() {
    this.ws = new WebSocket(`${this.url}?token=${this.token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      // TODO: (James) Handle Events
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (ev: CloseEvent) => {
      const { code, reason } = ev;
      if (code === 1000) {
        return;
      }
      console.log('WebSocket connection closed');
      this.stopHeartbeat();
      // Optionally, try to reconnect
      setTimeout(() => {
        this.connect();
      }, 5000); // 5 Seconds, Configur
    };
  }

  public isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  public sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message, token: this.token }));
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) return;
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'alive' }));
      }
    }, 10000); // TODO: (James) Config/Settings
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export default WebSocketClient;