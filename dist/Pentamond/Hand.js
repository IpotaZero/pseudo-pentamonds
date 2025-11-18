"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hand = void 0;
const Block_1 = require("./Block");
class Hand {
    static createFromColor(color) {
        if (color === "red") {
            return new Hand([
                new Block_1.Block(19, 9, "red", "up"),
                new Block_1.Block(18, 9, "red", "down"),
                new Block_1.Block(18, 8, "red", "up"),
                new Block_1.Block(18, 7, "red", "down"),
                new Block_1.Block(18, 6, "red", "up"),
            ]);
        }
        else if (color === "darkorange") {
            return new Hand([
                new Block_1.Block(19, 7, "darkorange", "up"),
                new Block_1.Block(18, 7, "darkorange", "down"),
                new Block_1.Block(18, 8, "darkorange", "up"),
                new Block_1.Block(18, 9, "darkorange", "down"),
                new Block_1.Block(18, 10, "darkorange", "up"),
            ]);
        }
        else if (color === "lime") {
            return new Hand([
                new Block_1.Block(19, 8, "lime", "up"),
                new Block_1.Block(18, 9, "lime", "up"),
                new Block_1.Block(18, 8, "lime", "down"),
                new Block_1.Block(18, 7, "lime", "up"),
                new Block_1.Block(18, 6, "lime", "down"),
            ]);
        }
        else if (color === "yellow") {
            return new Hand([
                new Block_1.Block(19, 8, "yellow", "up"),
                new Block_1.Block(18, 7, "yellow", "up"),
                new Block_1.Block(18, 8, "yellow", "down"),
                new Block_1.Block(18, 9, "yellow", "up"),
                new Block_1.Block(18, 10, "yellow", "down"),
            ]);
        }
        else if (color === "purple") {
            return new Hand([
                new Block_1.Block(18, 10, "purple", "up"),
                new Block_1.Block(18, 9, "purple", "down"),
                new Block_1.Block(18, 8, "purple", "up"),
                new Block_1.Block(18, 7, "purple", "down"),
                new Block_1.Block(18, 6, "purple", "up"),
            ]);
        }
        else if (color === "blue") {
            return new Hand([
                new Block_1.Block(19, 7, "blue", "up"),
                new Block_1.Block(18, 7, "blue", "down"),
                new Block_1.Block(18, 8, "blue", "up"),
                new Block_1.Block(18, 9, "blue", "down"),
                new Block_1.Block(19, 9, "blue", "up"),
            ]);
        }
        const n = color;
        throw new Error("知らない色だ");
    }
    blocks = [];
    constructor(blocks) {
        this.blocks = blocks;
    }
    getColor() {
        return this.blocks[0]?.color;
    }
    moveBy(dr, dc) {
        return new Hand(this.blocks.map((b) => b.moveBy(dr, dc)));
    }
    getRotatedBlocks(direction) {
        const center = this.blocks[2];
        const blocks = this.blocks.map((block) => {
            const rotate = this.#rotate(center.state, direction, block.col - center.col, block.row - center.row);
            return block.moveTo(center.row + rotate[1], center.col + rotate[0]).rotate();
        });
        return blocks;
    }
    #rotate(centerState, direction, x, y) {
        // △ right の場合だけ考えてる
        const map = {
            "0,0": [0, 0],
            // L1 = 1
            "1,0": [1, 0],
            "-1,0": [0, 1],
            "0,-1": [-1, 0],
            // L1 = 2
            "2,0": [1, -1],
            "-2,0": [-1, 1],
            "1,1": [2, 0],
            "1,-1": [-1, -1],
            "-1,1": [1, 1],
            "-1,-1": [-2, 0],
        };
        const dParity = direction === "right" ? 1 : -1;
        const sParity = centerState === "up" ? 1 : -1;
        const result = map[`${x * dParity * sParity},${y * sParity}`];
        result[0] *= dParity * sParity;
        result[1] *= sParity;
        return result;
    }
}
exports.Hand = Hand;
