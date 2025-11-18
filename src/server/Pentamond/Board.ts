import { Block } from "./Block"

export class Board {
    static readonly #ROWS = 20
    static readonly #COLS = 17

    #blocks: Block[][]

    constructor() {
        this.#blocks = this.#setupBlocks()
    }

    deleteRow(): Block[] {
        const row = this.#blocks.shift()

        this.#blocks = this.#blocks.map((row) => row.map((block) => block.moveBy(-1, 0)))

        this.#blocks.push(
            Array.from({ length: Board.#COLS }, (_, column) => new Block(Board.#ROWS - 1, column, "red", "none")),
        )

        return row!
    }

    canDelete() {
        return this.#blocks[0].some((b) => b.state !== "none")
    }

    getImageData(): number[] {
        return this.#blocks.flat().map((b) => b.serialize())
    }

    setBlock(block: Block, force = false) {
        if (!force && !this.canPut(block)) {
            console.error("ここには置けないぞ!")
            return
        }

        this.#blocks[block.row][block.col] = block
    }

    getBlocks() {
        return this.#blocks.map((row) => row.map((block) => block.copy()))
    }

    canPut(block: Block) {
        // そもそも範囲内?
        const Z = 0 <= block.row && block.row < Board.#ROWS && 0 <= block.col && block.col < Board.#COLS

        if (!Z) return false

        // 同じマスにはない
        const A = this.#blocks[block.row][block.col].state === "none"

        // 左側のブロックの向きが自身と異なる（若しくは存在しない）
        const B = block.col === 0 || this.#blocks[block.row][block.col - 1].state !== block.state

        // 右
        const C = block.col === Board.#COLS - 1 || this.#blocks[block.row][block.col + 1].state !== block.state

        return A && B && C
    }

    #setupBlocks(): Block[][] {
        return Array.from({ length: Board.#ROWS }, (_, i) =>
            Array.from({ length: Board.#COLS }, (_, j) => new Block(i, j, "red", "none")),
        )
    }
}
