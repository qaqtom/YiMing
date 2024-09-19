
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const routes = require('./routes');
const clients = new Map();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

const server = http.createServer(app);

// const wss = new WebSocket.Server({ server });

// // 心跳检测间隔
// const HEARTBEAT_INTERVAL = 30000;

// wss.on('connection', (ws) => {
//     ws.id = Date.now();  // 为每个连接分配唯一ID
//     clients.set(ws.id, ws);

//     ws.isAlive = true;
//     ws.on('pong', () => {
//         ws.isAlive = true;
//     });

//     const interval = setInterval(() => {
//         if (!ws.isAlive) {
//             console.log('WebSocket is not alive, terminating connection:', ws.id);
//             clearInterval(interval);
//             ws.terminate();
//             clients.delete(ws.id);  // 删除已断开的客户端
//             return;
//         }
//         ws.isAlive = false;
//         ws.ping();
//     }, HEARTBEAT_INTERVAL);

//     ws.on('close', () => {
//         console.log('WebSocket closed:', ws.id);
//         clearInterval(interval);
//         clients.delete(ws.id);
//     });

//     ws.on('error', (error) => {
//         console.error('WebSocket error:', error);
//         clearInterval(interval);
//         clients.delete(ws.id);
//     });
// });

// 启动服务器
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});