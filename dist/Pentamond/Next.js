"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Next = void 0;
const Block_1 = require("./Block");
class Next {
    // 次に出てくるブロックの色を保持する配列
    #next = [];
    #left = [];
    // ログを保存しておく
    #log = [];
    constructor(first) {
        this.#next = [...first];
        this.#left = this.#shuffle(Block_1.Block.colors);
        this.#log = [...this.#left];
    }
    seek() {
        return this.#next.concat(this.#left).slice(0, 4);
    }
    // 次のブロックを取得する際に、バッグが空の場合に新しいバッグを生成する
    getNext() {
        // 次のブロックがなければ補充する
        if (this.#next.length === 0) {
            this.#refillNext();
        }
        // 次のブロックを取り出して返す
        return this.#next.shift();
    }
    getLog() {
        return [...this.#log];
    }
    unshift(color) {
        this.#next.unshift(color);
    }
    #refillNext() {
        this.#next = this.#left;
        this.#left = this.#shuffle(Block_1.Block.colors);
        this.#log.push(...this.#left);
    }
    #shuffle(array) {
        const cloneArray = [...array];
        for (let idx = cloneArray.length - 1; idx > 0; idx--) {
            const rand = Math.floor(Math.random() * (idx + 1));
            const temp = cloneArray[idx];
            cloneArray[idx] = cloneArray[rand];
            cloneArray[rand] = temp;
        }
        return cloneArray;
    }
}
exports.Next = Next;
