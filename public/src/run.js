import { Input } from "./Pentamond/Input.js";
import { Room } from "./Room.js";
Input.init();
const socket = io();
socket.on("setup", (players, playerId) => {
    console.log(players);
    const room = new Room(socket, players, playerId);
});
window.socket = socket;
document.addEventListener("DOMContentLoaded", () => {
    const pages = new Map();
    pages.set("room-entrance", document.querySelector("#room-entrance"));
    pages.set("pentamond", document.querySelector("#pentamond"));
    setupRoomEntrance();
    setupReadyButton();
    function setupRoomEntrance() {
        const form = pages.get("room-entrance").querySelector("form");
        const input = form.querySelector("input");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            socket.emit("join-room", input.value);
            pages.forEach((p, id) => {
                p.classList.toggle("hidden", id !== "pentamond");
            });
        });
    }
    function setupReadyButton() {
        const ready = pages.get("pentamond").querySelector("#ready");
        ready.onclick = () => {
            ready.textContent = "WAIT...";
            ready.onclick = null;
            socket.emit("ready");
        };
    }
});
