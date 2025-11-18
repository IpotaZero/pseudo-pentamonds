"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const GameServer_js_1 = require("./GameServer.js");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use(express_1.default.static("public"));
/* ---------- 実行 ---------- */
const gameServer = new GameServer_js_1.GameServer(io);
const PORT = 8080;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`http://localhost:${PORT} でサーバー起動中`);
});
