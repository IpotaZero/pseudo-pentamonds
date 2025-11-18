"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
class Game {
    lines = 0;
    #startTime = performance.now();
    getCurrentTime() {
        return performance.now() - this.#startTime;
    }
}
exports.Game = Game;
