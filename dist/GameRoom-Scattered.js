"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoomScattered = void 0;
const GameRoom_1 = require("./GameRoom");
class GameRoomScattered extends GameRoom_1.GameRoom {
    $handleAction(player, action) {
        super.$handleAction(player, action);
        if (player.pentamond.game.lines >= 15) {
            this.$room.emit("finish", player.id, player.pentamond.game.getCurrentTime());
        }
    }
    $onReady(player) {
        super.$onReady(player);
        player.socket.emit("start");
    }
}
exports.GameRoomScattered = GameRoomScattered;
