type EventCallback = (data: any) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private url: string, private token: string) { }

  public connect() {
    if (this.isConnected()) {
      console.log('WebSocket is already connected');
      return;
    }

    console.log('Connecting to WebSocket...');
    this.ws = new WebSocket(`${this.url}?token=${this.token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
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
      }, 5000); // 5 Seconds, Configurable
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

  public disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect'); // 1000 indicates a normal closure
      this.ws = null;
      this.stopHeartbeat();
    }
  }

  public on(event: string, callback: EventCallback) {
    if (this.ws) {
      this.ws.addEventListener(event, (e: MessageEvent) => callback(JSON.parse(e.data)));
    }
  }

  public off(event: string) {
    if (this.ws) {
      this.ws.removeEventListener(event, () => { });
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