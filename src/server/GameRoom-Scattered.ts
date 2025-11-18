import { GamePlayer } from "./GamePlayer"
import { GameRoom } from "./GameRoom"

export class GameRoomScattered extends GameRoom {
    protected $handleAction(player: GamePlayer, action: string): void {
        super.$handleAction(player, action)

        if (player.pentamond.record.lines >= 15) {
            player.pentamond.finish()
            this.$room.emit("finish", player.id, player.pentamond.record.getCurrentTime())
        }
    }

    protected $onReady(player: GamePlayer): void {
        super.$onReady(player)
        player.socket.emit("start")
    }
}
