import { handleUserInput } from "./HandleIncomingMessage.js";

const SimConListener = (ws, req) => {
  console.info("Connection Established")

  const socketWriter = message => ws.send(JSON.stringify(message));
  const clientAddres = req.socket.remoteAddress;
  const clientPort = req.socket.remotePort;

  socketWriter({type: "connection", message: "Connection Established"});
  socketWriter({type: "chat", message: "Welcome to TBO Holiday Planner. How can i help you today?"});

  ws.on("message", async message => {
    console.log(`Data received from Socket : ${clientAddres}:${clientPort} : ${message}`)
    handleUserInput(JSON.parse(message), socketWriter);
  });

  //Handle client connection termination.
  ws.on("close", function() {
    console.warn(`${clientAddres}:${clientPort} Terminated the connection`)
    socketWriter({type: "connection", message: "Connection Terminated"});
  });

  //Handle Client connection error.
  ws.on("error", function(error) {
    console.error(`${clientAddres}:${clientPort} Connection Error ${error}`)
  });
};

export default SimConListener;
