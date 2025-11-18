import { Block } from "./Block"

export class Next {
    // 次に出てくるブロックの色を保持する配列
    #next: Block.Color[] = []
    #left: Block.Color[] = []

    // ログを保存しておく
    #log: Block.Color[] = []

    constructor(first: Block.Color[]) {
        this.#next = [...first]
        this.#left = this.#shuffle(Block.colors)
        this.#log = [...this.#left]
    }

    seek() {
        return this.#next.concat(this.#left).slice(0, 4)
    }

    // 次のブロックを取得する際に、バッグが空の場合に新しいバッグを生成する
    getNext(): Block.Color {
        // 次のブロックがなければ補充する
        if (this.#next.length === 0) {
            this.#refillNext()
        }

        // 次のブロックを取り出して返す
        return this.#next.shift()!
    }

    getLog() {
        return [...this.#log]
    }

    unshift(color: Block.Color) {
        this.#next.unshift(color)
    }

    #refillNext() {
        this.#next = this.#left
        this.#left = this.#shuffle(Block.colors)
        this.#log.push(...this.#left)
    }

    #shuffle<T>(array: ReadonlyArray<T>) {
        const cloneArray = [...array]

        for (let idx = cloneArray.length - 1; idx > 0; idx--) {
            const rand = Math.floor(Math.random() * (idx + 1))
            const temp = cloneArray[idx]
            cloneArray[idx] = cloneArray[rand]
            cloneArray[rand] = temp
        }

        return cloneArray
    }
}
