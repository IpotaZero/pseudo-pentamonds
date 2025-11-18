export class Drawer {
    // 定数: 行数、列数、ブロックサイズ、全体サイズ
    static readonly #ROWS = 20
    static readonly #COLS = 17
    static readonly #SUB_ROWS = 17
    static readonly #SUB_COLS = 5
    static readonly #BLOCK_WIDTH = 96
    static readonly #BLOCK_HEIGHT = Math.floor(Drawer.#BLOCK_WIDTH * Math.sqrt(3) * 0.5)
    static readonly #WIDTH = Drawer.#BLOCK_WIDTH * (Drawer.#COLS + 1) * 0.5
    static readonly #HEIGHT = Drawer.#BLOCK_HEIGHT * Drawer.#ROWS
    static readonly #SUB_WIDTH = Drawer.#BLOCK_WIDTH * (Drawer.#SUB_COLS + 1) * 0.5
    static readonly #SUB_HEIGHT = Drawer.#BLOCK_HEIGHT * Drawer.#SUB_ROWS

    // DOM要素
    readonly container = document.createElement("div")
    readonly #cvs: HTMLCanvasElement
    readonly #ctx: CanvasRenderingContext2D
    readonly #subCvs: HTMLCanvasElement
    readonly #subCtx: CanvasRenderingContext2D
    readonly #lines: HTMLDivElement
    readonly #time: HTMLDivElement

    readonly #resolution: number

    constructor(resolution: number) {
        this.#resolution = resolution

        this.container.innerHTML = `
            <canvas class="cvs-main"></canvas>
            <div class="sub-area">
                <div class="text-area">
                    <div class="lines"></div>
                    <div class="time"></div>
                    <button class="retry">RETRY</button>
                </div>
                <canvas class="cvs-sub"></canvas>
            </div>
        `

        this.#cvs = this.container.querySelector(".cvs-main")!
        this.#cvs.width = Drawer.#WIDTH * resolution
        this.#cvs.height = Drawer.#HEIGHT * resolution
        this.#ctx = this.#cvs.getContext("2d")!
        this.#ctx.scale(resolution, resolution)

        this.#subCvs = this.container.querySelector(".cvs-sub")!
        this.#subCvs.width = Drawer.#SUB_WIDTH * resolution
        this.#subCvs.height = Drawer.#SUB_HEIGHT * resolution
        this.#subCtx = this.#subCvs.getContext("2d")!
        this.#subCtx.scale(resolution, resolution)

        this.#lines = this.container.querySelector(".lines")!
        this.#time = this.container.querySelector(".time")!

        this.container.className = "container"
    }

    updateTime(time: number) {
        this.#time.textContent = `TIME: ${(time / 1000).toFixed(3)}`
    }

    // 描画処理
    draw(data: { board: number[]; ghost: number[]; sub: number[]; lines: number }): void {
        this.#lines.textContent = `LINES: ${data.lines}`

        // メインキャンバスクリア
        this.#ctx.clearRect(0, 0, Drawer.#WIDTH, Drawer.#HEIGHT)

        // ボード背景
        this.#ctx.fillStyle = "darkcyan"
        this.#ctx.fillRect(0, Drawer.#BLOCK_HEIGHT * 5, Drawer.#WIDTH, Drawer.#BLOCK_HEIGHT)
        this.#ctx.lineWidth = 2

        // 縦線描画
        this.#ctx.strokeStyle = "gray"
        for (let i = 0; i < 8; i++) {
            this.#ctx.beginPath()
            const x = (i + 1) * Drawer.#BLOCK_WIDTH
            this.#ctx.moveTo(x, 0)
            this.#ctx.lineTo(x, Drawer.#HEIGHT)
            this.#ctx.stroke()
        }

        // ゴースト描画
        this.#ctx.globalAlpha = 0.5
        this.#drawBlocks(data.ghost, Drawer.#COLS, this.#ctx)
        this.#ctx.globalAlpha = 1

        // ボード描画
        this.#drawBlocks(data.board, Drawer.#COLS, this.#ctx)

        // サブキャンバスクリア
        this.#subCtx.clearRect(0, 0, Drawer.#SUB_WIDTH, Drawer.#SUB_HEIGHT)
        this.#subCtx.fillStyle = "darkcyan"
        this.#subCtx.fillRect(0, Drawer.#BLOCK_HEIGHT * 4, Drawer.#SUB_WIDTH, Drawer.#BLOCK_HEIGHT)

        // サブ描画
        this.#drawBlocks(data.sub, 5, this.#subCtx)
    }

    // ブロック群描画
    #drawBlocks(data: number[], cols: number, ctx: CanvasRenderingContext2D) {
        // 0 -> 描画なし
        // 1,2 -> 赤
        // 3,4 -> オレンジ
        // 5,6 -> ライム
        // 7,8 -> 黄色
        // 9,10 -> 紫
        // 11,12 -> 青
        // 偶数 -> 下向き, 奇数 -> 上向き
        const colors = ["red", "darkorange", "lime", "yellow", "purple", "blue"]

        ctx.lineWidth = 3
        ctx.strokeStyle = "gray"

        data.forEach((state, index) => {
            if (state === 0) return

            const row = Math.floor(index / cols)
            const col = index % cols
            const upward = state % 2 === 0

            const x = col * Drawer.#BLOCK_WIDTH * 0.5
            const y = (Drawer.#ROWS - row - (upward ? 1 : 0)) * Drawer.#BLOCK_HEIGHT

            ctx.beginPath()
            ctx.fillStyle = colors[Math.floor((state - 1) / 2)]
            this.#drawTriangle(x, y, Drawer.#BLOCK_WIDTH, Drawer.#BLOCK_HEIGHT, upward, ctx)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        })
    }

    // 三角形描画
    #drawTriangle(x: number, y: number, w: number, h: number, upward: boolean, ctx: CanvasRenderingContext2D): void {
        ctx.moveTo(x, y)
        ctx.lineTo(x + w, y)
        if (upward) {
            ctx.lineTo(x + w / 2, y + h)
        } else {
            ctx.lineTo(x + w / 2, y - h)
        }
    }
}
