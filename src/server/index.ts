import express from "express"
import http from "http"
import { Server } from "socket.io"
import { GameServer } from "./GameServer.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

/* ---------- 実行 ---------- */
const gameServer = new GameServer(io)

const PORT = 8080
server.listen(PORT, "0.0.0.0", () => {
    console.log(`http://localhost:${PORT} でサーバー起動中`)
})
