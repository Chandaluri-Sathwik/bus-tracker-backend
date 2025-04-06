"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Driver_1 = __importDefault(require("./models/Driver"));
const _mongo_1 = __importDefault(require("./config/_mongo"));
const cors_1 = __importDefault(require("cors"));
const routers_1 = __importDefault(require("./routers"));
(0, _mongo_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        "https://portal.esummitiitm.org",
        /https?:\/\/localhost:\d{4}/,
        /https?:\/\/127.0.0.1:\d{4}/,
    ],
    methods: ["GET", "POST", "PATCH", "PUT"],
}), express_1.default.json(), express_1.default.urlencoded({ extended: true }));
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = socket.handshake.auth.token;
        if (!token)
            return next();
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
        const driver = yield Driver_1.default.findById(decoded.driverId);
        if (!driver)
            throw new Error('Driver not found');
        socket.driver = {
            _id: driver._id.toString(),
            busNumber: driver.busNumber
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error.message);
        next(new Error('Authentication failed'));
    }
}));
io.on('connection', (socket) => {
    console.log(socket.driver
        ? `Driver connected: ${socket.driver.busNumber}`
        : `User connected: ${socket.id}`);
    socket.on('positionUpdate', (position) => {
        if (!socket.driver)
            return;
        const busData = {
            busNumber: socket.driver.busNumber,
            position,
            timestamp: Date.now()
        };
        console.log(busData);
        io.emit('busPosition', busData);
    });
    socket.on('disconnect', () => {
        console.log(socket.driver
            ? `Driver disconnected: ${socket.driver.busNumber}`
            : `User disconnected: ${socket.id}`);
    });
});
app.use("/driver/", routers_1.default);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map