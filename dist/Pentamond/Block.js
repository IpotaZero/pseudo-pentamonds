"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
class Block {
    color;
    state;
    row;
    col;
    constructor(row, col, color, state) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.state = state;
    }
    moveBy(dr, dc) {
        return new Block(this.row + dr, this.col + dc, this.color, this.state);
    }
    moveTo(r, c) {
        return new Block(r, c, this.color, this.state);
    }
    rotate() {
        return new Block(this.row, this.col, this.color, this.#rotatedState());
    }
    #rotatedState() {
        if (this.state === "none")
            return "none";
        return this.state === "up" ? "down" : "up";
    }
    serialize() {
        if (this.state === "none")
            return 0;
        const i = Block.colors.findIndex((c) => c === this.color);
        if (i === -1)
            throw new Error("知らない色だ");
        const s = this.state === "down" ? 1 : 0;
        return 2 * i + s + 1;
    }
    copy() {
        return new Block(this.row, this.col, this.color, this.state);
    }
}
exports.Block = Block;
(function (Block) {
    Block.colors = ["red", "darkorange", "lime", "yellow", "purple", "blue"];
})(Block || (exports.Block = Block = {}));
