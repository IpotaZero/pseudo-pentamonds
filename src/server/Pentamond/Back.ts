import { Block } from "./Block"

export class Back {
    blocks: Block[][] | null = null
    previous: Block.Color | null = null

    set(blocks: Block[][] | null, color: Block.Color | null) {
        this.blocks = blocks
        this.previous = color
    }

    /**
     * 一手戻し可能か
     */
    isAvailable(): this is this & { blocks: Block[][]; previous: Block.Color } {
        return !!this.blocks && !!this.previous
    }
}
