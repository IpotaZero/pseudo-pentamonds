"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Back = void 0;
class Back {
    blocks = null;
    previous = null;
    set(blocks, color) {
        this.blocks = blocks;
        this.previous = color;
    }
    /**
     * 一手戻し可能か
     */
    isAvailable() {
        return !!this.blocks && !!this.previous;
    }
}
exports.Back = Back;
