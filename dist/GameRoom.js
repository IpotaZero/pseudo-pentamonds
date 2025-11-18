"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const GamePlayer_1 = require("./GamePlayer");
const Pentamond_1 = require("./Pentamond/Pentamond");
/* ---------- ゲームルーム ---------- */
class GameRoom {
    players = new Map();
    $id;
    $room;
    constructor(id, io) {
        this.$id = id;
        this.$room = io.to(id);
    }
    addPlayer(socket) {
        const player = new GamePlayer_1.GamePlayer(socket);
        this.players.set(player.id, player);
        this.#setup(player);
    }
    removePlayer(socket) {
        this.players.delete(socket.id);
        this.$room.emit("leave-player", socket.id);
        console.log(`ユーザー退室: ${socket.id} ${this.$id}`);
    }
    $onReady(player) {
        player.pentamond.start();
        this.#sendDraw(player);
    }
    $handleAction(player, action) {
        player.handleAction(action);
        this.#sendDraw(player);
    }
    #setup(player) {
        // enter room
        player.socket.join(this.$id);
        this.$room.emit("new-player", player.id);
        console.log(`ユーザー入室: ${player.id} ${this.$id}`);
        // drawerの準備
        player.socket.emit("setup", [...this.players.keys()], player.id);
        player.socket.on("ready", () => {
            this.$onReady(player);
        });
        player.socket.on("action", (action) => {
            this.$handleAction(player, action);
        });
        player.socket.on("retry", () => {
            player.pentamond = new Pentamond_1.Pentamond();
            this.$onReady(player);
        });
    }
    #sendDraw(player) {
        const data = player.getVisualData();
        this.$room.emit("draw", {
            board: pack(data.board),
            ghost: pack(data.ghost),
            sub: pack(data.sub),
            lines: data.lines,
        }, player.id);
    }
}
exports.GameRoom = GameRoom;
/* ---------- ユーティリティ ---------- */
function pack(values) {
    const bytes = [];
    for (let i = 0; i < values.length; i += 2) {
        const hi = values[i] & 0x0f;
        const lo = values[i + 1] !== undefined ? values[i + 1] & 0x0f : 0;
        bytes.push((hi << 4) | lo);
    }
    return new Uint8Array(bytes);
}
