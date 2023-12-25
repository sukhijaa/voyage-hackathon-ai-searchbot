export class SendTCPMessage {
  webSocket;
  listener;

  constructor(listener) {
    this.openConnection(listener);
  }

  openConnection = (listener) => {
    const createdUrl = `ws://${window.location.hostname}:4000/`
    this.webSocket = new WebSocket(createdUrl);
    this.webSocket.onopen = this.onConnectionOpen;
    this.webSocket.onclose = this.onConnectionClose;
    this.webSocket.onmessage = this.onMessageReceived;
    this.listener = listener
  };

  sendMessage = data => {
    if (this.webSocket && this.webSocket.url) {
      console.log(`Date Send to ${this.webSocket.url} : ${JSON.stringify(data)}`);
      this.webSocket.send(JSON.stringify(data));
    }
  };

  onConnectionOpen = () => {
    console.log("Connection Established")
  };

  onMessageReceived = evt => {
    console.log(JSON.parse(evt.data));
    this.listener(JSON.parse(evt.data))
  };

  onConnectionClose = () => {
    console.log(`TCP Connection Closed with : ${this.webSocket.url}`);
    this.webSocket = null;
  };

  closeConnection = () => {
    if (this.webSocket) {
      this.webSocket.close();
    }
  };

  isConnectionValid = () => {
    if (!this.webSocket) {
      return false;
    }
  };
}
