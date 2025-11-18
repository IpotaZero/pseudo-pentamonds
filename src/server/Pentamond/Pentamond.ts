import { Back } from "./Back"
import { Block } from "./Block"
import { Board } from "./Board"
import { Game } from "./Game"
import { Hand } from "./Hand"
import { Next } from "./Next"

export class Pentamond {
    static #createNullImageData(rows: number, cols: number): number[] {
        return Array.from({ length: rows * cols }, () => 0)
    }

    readonly #board: Board = new Board()

    readonly #next = new Next([])
    readonly #back = new Back()
    #hold: Block.Color | null = null
    #hand: Hand = Hand.createFromColor(this.#next.getNext())

    #isPlayable = false
    #isEnd = false

    game!: Game

    start() {
        this.game = new Game()
        this.#isPlayable = true
    }

    finish() {
        this.#isPlayable = false
        this.#isEnd = true
    }

    getVisualData() {
        return {
            ghost: this.#isPlayable ? this.#createGhostImageData() : Pentamond.#createNullImageData(20, 17),
            board: this.#isPlayable ? this.#createHandImageData() : this.#board.getImageData(),
            sub: this.#createSubImageData(),
            lines: this.game.lines,
        }
    }

    #createGhostImageData() {
        const d = Pentamond.#createNullImageData(20, 17)

        let h = new Hand(this.#hand.blocks)

        while (h.blocks.every((b) => this.#board.canPut(b.moveBy(-1, 0)))) {
            h = h.moveBy(-1, 0)
        }

        h.blocks.map((b) => {
            const i = b.row * 17 + b.col
            d[i] = b.serialize()
        })

        return d
    }

    #createHandImageData() {
        const d = this.#board.getImageData()

        this.#hand.blocks.forEach((b) => {
            const i = b.row * 17 + b.col

            d[i] = b.serialize()
        })

        return d
    }

    #createSubImageData() {
        const d = Pentamond.#createNullImageData(17, 5)

        if (this.#hold) {
            Hand.createFromColor(this.#hold).blocks.forEach((b) => {
                const i = b.row * 5 + b.col - 6 - 5

                d[i] = b.serialize()
            })
        }

        this.#next.seek().forEach((c, i) => {
            Hand.createFromColor(c)
                .moveBy(-(i + 1) * 3, 0)
                .blocks.forEach((b) => {
                    const i = b.row * 5 + b.col - 6 - 10

                    d[i] = b.serialize()
                })
        })

        return d
    }

    put() {
        if (!this.#isPlayable || this.#isEnd) return

        // バックアップを取る
        this.#back.set(this.#board.getBlocks(), this.#hand.getColor())

        while (this.#moveBy(-1, 0));

        this.#hand.blocks.forEach((b) => {
            this.#board.setBlock(b)
        })

        this.#hand = Hand.createFromColor(this.#next.getNext())

        this.#checkPlayable()
    }

    down() {
        if (!this.#isPlayable || this.#isEnd) return
        this.#moveBy(-1, 0) || this.#moveBy(-1, -1) || this.#moveBy(-1, 1)
    }

    move(direction: "left" | "right") {
        if (!this.#isPlayable || this.#isEnd) return

        if (direction === "left") {
            this.#moveBy(0, -1)
        } else {
            this.#moveBy(0, 1)
        }
    }

    rotate(direction: "right" | "left") {
        if (!this.#isPlayable || this.#isEnd) return

        const rotated = this.#hand.getRotatedBlocks(direction)

        const displacements = [
            [0, 0],
            //
            [-1, 0],
            [1, 0],
            //
            [0, -1],
            [0, 1],
        ]

        // 最も早く置ける平行移動
        const validDisplacement = displacements.find(([dx, dy]) =>
            rotated.every((block) => this.#board.canPut(block.moveBy(dx, dy))),
        )

        if (validDisplacement) {
            const [dx, dy] = validDisplacement
            this.#hand = new Hand(rotated.map((block) => block.moveBy(dx, dy)))
        }
    }

    hold() {
        if (this.#isEnd) return

        if (this.#hold) {
            ;[this.#hold, this.#hand] = [this.#hand.getColor(), Hand.createFromColor(this.#hold)]
        } else {
            this.#hold = this.#hand.getColor()
            this.#hand = Hand.createFromColor(this.#next.getNext())
        }

        this.#checkPlayable()
    }

    back() {
        if (this.#isEnd) return

        // 戻せる手がない場合
        if (!this.#back.isAvailable()) return

        // 次に来る手を戻す
        this.#next.unshift(this.#hand.getColor())

        // 手を戻す
        this.#hand = Hand.createFromColor(this.#back.previous)

        // バックアップから復元
        this.#back.blocks.forEach((row) => {
            row.forEach((block) => {
                this.#board.setBlock(block, true)
            })
        })

        //  一手戻しできなくする
        this.#back.set(null, null)

        this.#checkPlayable()
    }

    delete() {
        if (this.#isEnd) return

        // 全空白なら消さない
        if (!this.#board.canDelete()) return

        // 1列揃ってたらline++
        const deletedRow = this.#board.deleteRow()
        if (deletedRow.every((b) => b.state !== "none")) {
            this.game.lines++
        }

        // 一手戻しできなくする
        this.#back.set(null, null)

        this.#checkPlayable()
    }

    #moveBy(dr: number, dc: number) {
        if (this.#hand.blocks.length === 0) throw new Error("handが0")

        const canPut = this.#hand.blocks.every((b) => this.#board.canPut(b.moveBy(dr, dc)))

        if (canPut) {
            this.#hand = this.#hand.moveBy(dr, dc)
            return true
        }

        return false
    }

    #checkPlayable() {
        this.#isPlayable = this.#hand.blocks.every((block) => this.#board.canPut(block))
    }
}
