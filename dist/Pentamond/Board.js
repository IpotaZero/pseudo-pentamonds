"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const Block_1 = require("./Block");
class Board {
    static #ROWS = 20;
    static #COLS = 17;
    #blocks;
    constructor() {
        this.#blocks = this.#setupBlocks();
    }
    deleteRow() {
        const row = this.#blocks.shift();
        this.#blocks = this.#blocks.map((row) => row.map((block) => block.moveBy(-1, 0)));
        this.#blocks.push(Array.from({ length: Board.#COLS }, (_, column) => new Block_1.Block(Board.#ROWS - 1, column, "red", "none")));
        return row;
    }
    canDelete() {
        return this.#blocks[0].some((b) => b.state !== "none");
    }
    getImageData() {
        return this.#blocks.flat().map((b) => b.serialize());
    }
    setBlock(block, force = false) {
        if (!force && !this.canPut(block)) {
            console.error("ここには置けないぞ!");
            return;
        }
        this.#blocks[block.row][block.col] = block;
    }
    getBlocks() {
        return this.#blocks.map((row) => row.map((block) => block.copy()));
    }
    canPut(block) {
        // そもそも範囲内?
        const Z = 0 <= block.row && block.row < Board.#ROWS && 0 <= block.col && block.col < Board.#COLS;
        if (!Z)
            return false;
        // 同じマスにはない
        const A = this.#blocks[block.row][block.col].state === "none";
        // 左側のブロックの向きが自身と異なる（若しくは存在しない）
        const B = block.col === 0 || this.#blocks[block.row][block.col - 1].state !== block.state;
        // 右
        const C = block.col === Board.#COLS - 1 || this.#blocks[block.row][block.col + 1].state !== block.state;
        return A && B && C;
    }
    #setupBlocks() {
        return Array.from({ length: Board.#ROWS }, (_, i) => Array.from({ length: Board.#COLS }, (_, j) => new Block_1.Block(i, j, "red", "none")));
    }
}
exports.Board = Board;
