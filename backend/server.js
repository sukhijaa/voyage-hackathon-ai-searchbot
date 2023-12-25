import express from "express";
import { join, dirname } from "path";
import SimConListener from "./ConnectionListener.js";
import { WebSocketServer } from "ws";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const staticPath = join(__dirname, 'build');
console.log(`Setting Static Path to : ${staticPath}`);
app.use(express.static(staticPath));

console.log('All routes serving index.html');

app.get('/*', function(req, res) {
  res.sendFile(join(__dirname, 'build', 'index.html'));
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

