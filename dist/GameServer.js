"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
const GameRoom_Scattered_1 = require("./GameRoom-Scattered");
/* ---------- サーバー全体 ---------- */
class GameServer {
    #rooms = new Map();
    #io;
    constructor(io) {
        this.#io = io;
        this.#io.on("connection", (socket) => this.#onConnection(socket));
    }
    #onConnection(socket) {
        console.log(`ユーザー接続: ${socket.id}`);
        socket.on("join-room", (roomId) => {
            if (!this.#rooms.has(roomId)) {
                this.#rooms.set(roomId, new GameRoom_Scattered_1.GameRoomScattered(roomId, this.#io));
            }
            const room = this.#rooms.get(roomId);
            room.addPlayer(socket);
            socket.on("disconnect", () => {
                room.removePlayer(socket);
                if (room.players.size === 0) {
                    this.#rooms.delete(roomId);
                }
            });
        });
        socket.on("disconnect", () => {
            console.log(`ユーザー切断: ${socket.id}`);
        });
    }
}
exports.GameServer = GameServer;
