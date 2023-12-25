const express = require("express")
const path = require("path");
const SimConListener = require("./backend/ConnectionListener.js")
const {WebSocketServer} = require("ws")

const app = express();

const staticPath = path.join(__dirname, 'build');
console.log(`Setting Static Path to : ${staticPath}`);
app.use(express.static(staticPath));

console.log('All routes serving index.html');

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log("Starting to create HTTP Server");

app.listen(8080, () => console.log('Server Started Succesfully'));

const wss = new WebSocketServer(
  {
    port: 4000,
    host: "0.0.0.0"
  },
  () => {
    console.info(`Simulator listening at port : 4000`)
  }
);

wss.on("connection", SimConListener);

