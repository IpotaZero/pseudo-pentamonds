"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRecord = void 0;
class GameRecord {
    lines = 0;
    #startTime = performance.now();
    getCurrentTime() {
        return performance.now() - this.#startTime;
    }
}
exports.GameRecord = GameRecord;
