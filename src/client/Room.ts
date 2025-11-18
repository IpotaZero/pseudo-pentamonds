import { Drawer } from "./Pentamond/Drawer.js"
import { Input } from "./Pentamond/Input.js"
import { Player } from "./Pentamond/Player.js"

export class Room {
    #drawers: Map<string, Drawer>

    #player: Player

    #socket: any

    #subContainer

    #playerId

    constructor(socket: any, players: string[], playerId: string) {
        this.#socket = socket
        this.#playerId = playerId

        this.#drawers = new Map(players.map((id) => [id, new Drawer(id === playerId ? 1 : 0.3)]))

        this.#player = new Player(socket, this.#drawers.get(playerId)!)

        const container = document.querySelector("#container")!
        this.#subContainer = document.querySelector("#sub-container")!

        container.appendChild(this.#drawers.get(playerId)!.container)

        this.#drawers.forEach((drawer, id) => {
            if (id === playerId) return
            this.#subContainer.appendChild(drawer.container)
        })

        this.#setup()
    }

    #setup() {
        this.#socket.on("draw", (msg: any, id: string) => {
            // console.log("draw", msg)

            const d = {
                board: this.#unpack(msg.board),
                ghost: this.#unpack(msg.ghost),
                sub: this.#unpack(msg.sub),
                lines: msg.lines,
            }

            this.#drawers.get(id)?.draw(d)
        })

        this.#socket.on("new-player", (id: string) => {
            const drawer = new Drawer(0.3)
            this.#drawers.set(id, drawer)
            this.#subContainer.appendChild(drawer.container)
        })

        this.#socket.on("leave-player", (id: string) => {
            const drawer = this.#drawers.get(id)
            drawer?.container.remove()
            this.#drawers.delete(id)
        })

        this.#socket.on("start", () => {
            document.querySelector("#ready")?.remove()

            Input.update()

            const drawer = this.#drawers.get(this.#socket.id)

            if (!drawer) {
                this.#drawers.set(this.#socket.id, new Drawer(1))
            }

            this.#player = new Player(this.#socket, this.#drawers.get(this.#socket.id)!)
            this.#player.start()
        })

        this.#socket.on("finish", (id: string, time: number) => {
            if (this.#playerId === id) {
                this.#player.finish()
            }

            console.log("finished")

            requestAnimationFrame(() => {
                this.#drawers.get(id)?.updateTime(time)
            })
        })

        this.#setupRetryButton()
    }

    #setupRetryButton() {
        const retry = this.#drawers.get(this.#playerId)!.container.querySelector<HTMLElement>(".retry")!

        retry.onclick = () => {
            this.#socket.emit("retry")
            retry.blur()
        }
    }

    #unpack(data: ArrayBuffer): number[] {
        const values: number[] = []
        const bytes = new Uint8Array(data)
        for (let byte of bytes) {
            values.push(byte >> 4)
            values.push(byte & 0x0f)
        }
        return values
    }
}
