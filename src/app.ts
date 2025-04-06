import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Driver from './models/Driver';
import connectToMongo from "./config/_mongo";
import cors from "cors";
import appRouter from './routers';
// import { registerDriver } from './controllers/AuthController';
interface ServerToClientEvents {
  busPosition: (data: BusPositionData) => void;
}

interface ClientToServerEvents {
  positionUpdate: (position: [number, number]) => void;
}

interface BusPositionData {
  busNumber: string;
  position: [number, number];
  timestamp: number;
}
interface CustomSocket extends Socket {
  driver?: {
    _id: string;
    busNumber: string;
  };
}
connectToMongo();
const app = express();
const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(
  cors({
    credentials: true,
    origin: [
      "https://portal.esummitiitm.org",
      /https?:\/\/localhost:\d{4}/,
      /https?:\/\/127.0.0.1:\d{4}/,
    ],
    methods: ["GET", "POST", "PATCH", "PUT"],
  }),
  express.json(),
  express.urlencoded({ extended: true })
);
io.use(async (socket: CustomSocket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.TOKEN_KEY!) as { driverId: string };
    const driver = await Driver.findById(decoded.driverId);

    if (!driver) throw new Error('Driver not found');
    
    socket.driver = {
      _id: driver._id.toString(),
      busNumber: driver.busNumber
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket: CustomSocket) => {
  console.log(socket.driver 
    ? `Driver connected: ${socket.driver.busNumber}` 
    : `User connected: ${socket.id}`);

  socket.on('positionUpdate', (position) => {
    if (!socket.driver) return;
    
    const busData: BusPositionData = {
      busNumber: socket.driver.busNumber,
      position,
      timestamp: Date.now()
    };
    console.log(busData)
    io.emit('busPosition', busData);
  });

  socket.on('disconnect', () => {
    console.log(socket.driver 
      ? `Driver disconnected: ${socket.driver.busNumber}`
      : `User disconnected: ${socket.id}`);
  });
});
app.use("/driver/", appRouter);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
