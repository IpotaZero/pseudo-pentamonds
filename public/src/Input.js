export class Input {
    static available = true;
    static keyboard = {
        pressed: new Set(),
        longPressed: new Set(),
        pushed: new Set(),
        upped: new Set(),
        get(key) {
            return this.pushed.has(key) || this.longPressed.has(key);
        },
    };
    static focusState = {
        isFocused: true,
        justFocused: false,
        justBlurred: false,
    };
    static #pressTiming = new Map();
    static #lastPublishTiming = performance.now();
    static #longPressInterval = new Map([
        ["KeyC", Infinity],
        ["KeyV", Infinity],
    ]);
    static init() {
        // Keyboard events
        document.addEventListener("keydown", this.#handleKeyDown.bind(this));
        document.addEventListener("keyup", this.#handleKeyUp.bind(this));
        // Window focus events
        window.addEventListener("blur", this.#handleBlur.bind(this));
        window.addEventListener("focus", this.#handleFocus.bind(this));
        document.addEventListener("visibilitychange", (e) => {
            if (document.visibilityState === "visible") {
                this.#handleFocus();
            }
            else {
                this.#handleBlur();
            }
        });
    }
    static #handleKeyDown(e) {
        if (!this.available)
            return;
        if (!this.keyboard.pressed.has(e.code)) {
            this.keyboard.pushed.add(e.code);
            this.#pressTiming.set(e.code, performance.now());
        }
        this.keyboard.pressed.add(e.code);
    }
    static #handleKeyUp(e) {
        if (!this.available)
            return;
        keyboard.longPressed.delete(e.code);
        this.keyboard.pressed.delete(e.code);
        this.keyboard.upped.add(e.code);
    }
    static #handleBlur() {
        console.log("よそ見するにゃ!");
        this.focusState.isFocused = false;
        this.focusState.justBlurred = true;
    }
    static #handleFocus() {
        console.log("こっち見んにゃ!");
        this.focusState.isFocused = true;
        this.focusState.justFocused = true;
    }
    static update() {
        this.keyboard.pushed.clear();
        this.keyboard.longPressed.clear();
        this.keyboard.upped.clear();
        this.focusState.justFocused = false;
        this.focusState.justBlurred = false;
        let isLongPressDetected = false;
        const now = performance.now();
        const last = this.#lastPublishTiming;
        this.keyboard.pressed.forEach((key) => {
            //  押してから200ms以上経ったら
            // 入力は基本20ms毎に制限
            const interval = this.#longPressInterval.get(key) ?? 20;
            if (now - this.#pressTiming.get(key) >= 180 && now - last > interval) {
                this.keyboard.longPressed.add(key);
                isLongPressDetected = true;
            }
        });
        if (isLongPressDetected)
            this.#lastPublishTiming = now;
        if (!this.available) {
            this.keyboard.pressed.clear();
        }
    }
}
export const { keyboard, focusState } = Input;
