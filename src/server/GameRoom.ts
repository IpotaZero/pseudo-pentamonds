import { Server, Socket } from "socket.io"
import { GamePlayer } from "./GamePlayer"
import { Pentamond } from "./Pentamond/Pentamond"

/* ---------- ゲームルーム ---------- */
export class GameRoom {
    players: Map<string, GamePlayer> = new Map()
    protected $id: string
    protected $room

    constructor(id: string, io: Server) {
        this.$id = id
        this.$room = io.to(id)
    }

    addPlayer(socket: Socket) {
        const player = new GamePlayer(socket)
        this.players.set(player.id, player)

        this.#setup(player)
    }

    removePlayer(socket: Socket) {
        this.players.delete(socket.id)
        this.$room.emit("leave-player", socket.id)
        console.log(`ユーザー退室: ${socket.id} ${this.$id}`)
    }

    protected $onReady(player: GamePlayer) {
        player.pentamond.start()
        this.#sendDraw(player)
    }

    protected $handleAction(player: GamePlayer, action: string) {
        player.handleAction(action)
        this.#sendDraw(player)
    }

    #setup(player: GamePlayer) {
        // enter room
        player.socket.join(this.$id)
        this.$room.emit("new-player", player.id)
        console.log(`ユーザー入室: ${player.id} ${this.$id}`)

        // drawerの準備
        player.socket.emit("setup", [...this.players.keys()], player.id)

        player.socket.on("ready", () => {
            this.$onReady(player)
        })

        player.socket.on("action", (action) => {
            this.$handleAction(player, action)
        })

        player.socket.on("retry", () => {
            player.pentamond = new Pentamond()
            this.$onReady(player)
        })
    }

    #sendDraw(player: GamePlayer) {
        const data = player.pentamond.getVisualData()

        this.$room.emit(
            "draw",
            {
                board: pack(data.board),
                ghost: pack(data.ghost),
                sub: pack(data.sub),
                lines: data.lines,
            },
            player.id,
        )
    }
}

/* ---------- ユーティリティ ---------- */
function pack(values: number[]): Uint8Array {
    const bytes: number[] = []
    for (let i = 0; i < values.length; i += 2) {
        const hi = values[i] & 0x0f
        const lo = values[i + 1] !== undefined ? values[i + 1] & 0x0f : 0
        bytes.push((hi << 4) | lo)
    }
    return new Uint8Array(bytes)
}
