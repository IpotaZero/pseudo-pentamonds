export class Block {
    readonly color: Block.Color
    readonly state: Block.State

    readonly row: number
    readonly col: number

    constructor(row: number, col: number, color: Block.Color, state: Block.State) {
        this.row = row
        this.col = col

        this.color = color
        this.state = state
    }

    moveBy(dr: number, dc: number) {
        return new Block(this.row + dr, this.col + dc, this.color, this.state)
    }

    moveTo(r: number, c: number) {
        return new Block(r, c, this.color, this.state)
    }

    rotate() {
        return new Block(this.row, this.col, this.color, this.#rotatedState())
    }

    #rotatedState(): Block.State {
        if (this.state === "none") return "none"
        return this.state === "up" ? "down" : "up"
    }

    serialize(): number {
        if (this.state === "none") return 0

        const i = Block.colors.findIndex((c) => c === this.color)

        if (i === -1) throw new Error("知らない色だ")

        const s = this.state === "down" ? 1 : 0

        return 2 * i + s + 1
    }

    copy() {
        return new Block(this.row, this.col, this.color, this.state)
    }
}

export namespace Block {
    export type State = "none" | "up" | "down"

    export const colors = ["red", "darkorange", "lime", "yellow", "purple", "blue"] as const
    export type Color = (typeof colors)[number]
}
