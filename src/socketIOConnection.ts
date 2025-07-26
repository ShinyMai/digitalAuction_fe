import { io, Socket } from "socket.io-client";

const VITE_SOCKETIO_URL = import.meta.env.VITE_SOCKETIO_URL;

const socketIOUrl = VITE_SOCKETIO_URL || "http://localhost:9999";

let socketIOConnection: Socket | null = null;

export const createSocketIOConnection = (token?: string): Socket => {
  if (socketIOConnection && socketIOConnection.connected) {
    return socketIOConnection;
  }

  socketIOConnection = io(socketIOUrl, {
    auth: {
      token: token || "",
    },
    transports: ["websocket", "polling"],
    autoConnect: false,
  });

  // Connection event handlers
  socketIOConnection.on("connect", () => {
    console.log("Socket.IO connected:", socketIOConnection?.id);
  });

  socketIOConnection.on("disconnect", (reason) => {
    console.log("Socket.IO isconnected:", reason);
  });

  socketIOConnection.on("connect_error", (error) => {
    console.error("Socket.IO connection error:", error);
  });

  return socketIOConnection;
};

export const getSocketIOConnection = (): Socket | null => {
  return socketIOConnection;
};

export const disconnectSocketIO = () => {
  if (socketIOConnection) {
    socketIOConnection.disconnect();
    socketIOConnection = null;
  }
};

export default {
  createConnection: createSocketIOConnection,
  getConnection: getSocketIOConnection,
  disconnect: disconnectSocketIO,
};
