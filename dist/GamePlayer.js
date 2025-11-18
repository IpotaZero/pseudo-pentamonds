"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlayer = void 0;
const Pentamond_js_1 = require("./Pentamond/Pentamond.js");
/* ---------- プレイヤー ---------- */
class GamePlayer {
    id;
    socket;
    pentamond;
    constructor(socket) {
        this.socket = socket;
        this.id = socket.id;
        this.pentamond = new Pentamond_js_1.Pentamond();
    }
    handleAction(action) {
        switch (action) {
            case "put":
                this.pentamond.put();
                break;
            case "left":
                this.pentamond.move("left");
                break;
            case "right":
                this.pentamond.move("right");
                break;
            case "down":
                this.pentamond.down();
                break;
            case "rl":
                this.pentamond.rotate("left");
                break;
            case "rr":
                this.pentamond.rotate("right");
                break;
            case "hold":
                this.pentamond.hold();
                break;
            case "back":
                this.pentamond.back();
                break;
            case "delete":
                this.pentamond.delete();
                break;
        }
    }
}
exports.GamePlayer = GamePlayer;
