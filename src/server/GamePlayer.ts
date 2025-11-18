import { Socket } from "socket.io"
import { Pentamond } from "./Pentamond/Pentamond.js"

/* ---------- プレイヤー ---------- */
export class GamePlayer {
    readonly id: string
    readonly socket: Socket
    pentamond: Pentamond

    constructor(socket: Socket) {
        this.socket = socket
        this.id = socket.id
        this.pentamond = new Pentamond()
    }

    handleAction(action: string) {
        switch (action) {
            case "put":
                this.pentamond.put()
                break
            case "left":
                this.pentamond.move("left")
                break
            case "right":
                this.pentamond.move("right")
                break
            case "down":
                this.pentamond.down()
                break
            case "rl":
                this.pentamond.rotate("left")
                break
            case "rr":
                this.pentamond.rotate("right")
                break
            case "hold":
                this.pentamond.hold()
                break
            case "back":
                this.pentamond.back()
                break
            case "delete":
                this.pentamond.delete()
                break
        }
    }
}
