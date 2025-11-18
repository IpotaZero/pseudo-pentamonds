import { Server, Socket } from "socket.io"
import { GameRoom } from "./GameRoom"
import { GameRoomScattered } from "./GameRoom-Scattered"

/* ---------- サーバー全体 ---------- */
export class GameServer {
    #rooms: Map<string, GameRoom> = new Map()
    #io: Server

    constructor(io: Server) {
        this.#io = io
        this.#io.on("connection", (socket) => this.#onConnection(socket))
    }

    #onConnection(socket: Socket) {
        console.log(`ユーザー接続: ${socket.id}`)

        socket.on("join-room", (roomId) => {
            if (!this.#rooms.has(roomId)) {
                this.#rooms.set(roomId, new GameRoomScattered(roomId, this.#io))
            }

            const room = this.#rooms.get(roomId)!
            room.addPlayer(socket)

            socket.on("disconnect", () => {
                room.removePlayer(socket)
                if (room.players.size === 0) {
                    this.#rooms.delete(roomId)
                }
            })
        })

        socket.on("disconnect", () => {
            console.log(`ユーザー切断: ${socket.id}`)
        })
    }
}
