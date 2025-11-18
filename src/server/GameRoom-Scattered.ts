import { GamePlayer } from "./GamePlayer"
import { GameRoom } from "./GameRoom"

export class GameRoomScattered extends GameRoom {
    protected $handleAction(player: GamePlayer, action: string): void {
        super.$handleAction(player, action)

        if (player.pentamond.game.lines >= 15) {
            this.$room.emit("finish", player.id, player.pentamond.game.getCurrentTime())
        }
    }

    protected $onReady(player: GamePlayer): void {
        super.$onReady(player)
        player.socket.emit("start")
    }
}
