import { keyboard, Input } from "./Input.js";
export class Player {
    #socket;
    #drawer;
    #startTime = 0;
    #ended = false;
    constructor(socket, drawer) {
        this.#drawer = drawer;
        this.#socket = socket;
    }
    #update() {
        this.#drawer.updateTime(performance.now() - this.#startTime);
        if (keyboard.pushed.has("ArrowUp")) {
            this.#socket.emit("action", "put");
        }
        else if (keyboard.get("ArrowLeft")) {
            this.#socket.emit("action", "left");
        }
        else if (keyboard.get("ArrowRight")) {
            this.#socket.emit("action", "right");
        }
        else if (keyboard.get("ArrowDown")) {
            this.#socket.emit("action", "down");
        }
        if (keyboard.pushed.has("KeyC")) {
            this.#socket.emit("action", "rl");
        }
        else if (keyboard.pushed.has("KeyV")) {
            this.#socket.emit("action", "rr");
        }
        if (keyboard.pushed.has("Space")) {
            this.#socket.emit("action", "hold");
        }
        else if (keyboard.pushed.has("KeyB")) {
            this.#socket.emit("action", "back");
        }
        else if (keyboard.get("Enter")) {
            this.#socket.emit("action", "delete");
        }
        Input.update();
        if (this.#ended)
            return;
        requestAnimationFrame(() => {
            this.#update();
        });
    }
    finish() {
        this.#ended = true;
    }
    start() {
        this.#startTime = performance.now();
        requestAnimationFrame(() => {
            this.#update();
        });
    }
}
