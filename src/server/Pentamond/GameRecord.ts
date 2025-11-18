export class GameRecord {
    lines = 0
    readonly #startTime = performance.now()

    getCurrentTime() {
        return performance.now() - this.#startTime
    }
}
