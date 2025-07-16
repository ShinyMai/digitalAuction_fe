/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from "@microsoft/signalr";
import { Socket } from "socket.io-client";
import signalRConnection from "../signalRConnection";
import { createSocketIOConnection } from "../socketIOConnection";

export interface BidData {
  auctionId: string;
  bidAmount: number;
  userId: string;
  userName: string;
}

export interface AuctionStatusData {
  auctionId: string;
  status: string;
  message: string;
  data?: any;
}

class SocketManager {
  private signalRConnection: signalR.HubConnection;
  private socketIOConnection: Socket | null = null;
  private isSignalRConnected = false;
  private isSocketIOConnected = false;

  constructor() {
    this.signalRConnection = signalRConnection;
  }

  // Initialize connections
  async initializeConnections(token?: string) {
    try {
      // Initialize SignalR (for .NET backend notifications)
      await this.connectSignalR(token);

      // Initialize Socket.IO (for Node.js backend real-time features)
      await this.connectSocketIO(token);

      console.log("All socket connections initialized");
    } catch (error) {
      console.error("Error initializing socket connections:", error);
    }
  }

  // SignalR methods
  private async connectSignalR(token?: string) {
    try {
      // If a token is provided, rebuild the connection with the token
      if (token) {
        // Stop existing connection if running
        if (this.signalRConnection.state === signalR.HubConnectionState.Connected) {
          await this.signalRConnection.stop();
        }

        // Create new connection with token
        this.signalRConnection = new signalR.HubConnectionBuilder()
          .withUrl(this.signalRConnection.baseUrl, {
            accessTokenFactory: () => token,
          })
          .build();
      }

      await this.signalRConnection.start();
      this.isSignalRConnected = true;
      console.log("SignalR connected successfully");

      // Setup SignalR event listeners
      this.setupSignalRListeners();
    } catch (error) {
      console.error("Error connecting to SignalR:", error);
      this.isSignalRConnected = false;
    }
  }

  private setupSignalRListeners() {
    // Listen for general notifications from .NET backend
    this.signalRConnection.on("ReceiveNotification", (message: string, data: any) => {
      console.log("SignalR Notification:", message, data);
      // Emit custom event for notification handling
      window.dispatchEvent(
        new CustomEvent("signalr-notification", {
          detail: { message, data },
        })
      );
    });

    // Listen for system updates
    this.signalRConnection.on("SystemUpdate", (updateData: any) => {
      console.log("SignalR System Update:", updateData);
      window.dispatchEvent(
        new CustomEvent("signalr-system-update", {
          detail: updateData,
        })
      );
    });
  }

  // Socket.IO methods
  private async connectSocketIO(token?: string) {
    try {
      this.socketIOConnection = createSocketIOConnection(token);

      // Connect to Socket.IO
      this.socketIOConnection.connect();

      // Setup Socket.IO event listeners
      this.setupSocketIOListeners();

      this.isSocketIOConnected = true;
      console.log("Socket.IO connected successfully");
    } catch (error) {
      console.error("Error connecting to Socket.IO:", error);
      this.isSocketIOConnected = false;
    }
  }

  private setupSocketIOListeners() {
    if (!this.socketIOConnection) return;

    // Auction real-time events
    this.socketIOConnection.on("newBid", (bidData: BidData) => {
      console.log("New bid received:", bidData);
      window.dispatchEvent(
        new CustomEvent("auction-new-bid", {
          detail: bidData,
        })
      );
    });

    this.socketIOConnection.on("auctionStatusUpdate", (statusData: AuctionStatusData) => {
      console.log("Auction status update:", statusData);
      window.dispatchEvent(
        new CustomEvent("auction-status-update", {
          detail: statusData,
        })
      );
    });

    this.socketIOConnection.on("auctionStart", (data: any) => {
      console.log("Auction started:", data);
      window.dispatchEvent(
        new CustomEvent("auction-start", {
          detail: data,
        })
      );
    });

    this.socketIOConnection.on("auctionEnd", (data: any) => {
      console.log("Auction ended:", data);
      window.dispatchEvent(
        new CustomEvent("auction-end", {
          detail: data,
        })
      );
    });

    this.socketIOConnection.on("participantCount", (data: any) => {
      console.log("Participant count update:", data);
      window.dispatchEvent(
        new CustomEvent("auction-participant-count", {
          detail: data,
        })
      );
    });
  }

  // Auction-specific methods (Socket.IO)
  joinAuction(auctionId: string) {
    if (this.socketIOConnection && this.isSocketIOConnected) {
      this.socketIOConnection.emit("joinAuction", auctionId);
      console.log(`Joined auction: ${auctionId}`);
    }
  }

  leaveAuction(auctionId: string) {
    if (this.socketIOConnection && this.isSocketIOConnected) {
      this.socketIOConnection.emit("leaveAuction", auctionId);
      console.log(`Left auction: ${auctionId}`);
    }
  }

  placeBid(bidData: BidData) {
    if (this.socketIOConnection && this.isSocketIOConnected) {
      this.socketIOConnection.emit("placeBid", bidData);
      console.log("Bid placed:", bidData);
    }
  }

  // Notification methods (SignalR)
  async sendNotification(message: string, data?: any) {
    if (this.signalRConnection && this.isSignalRConnected) {
      try {
        await this.signalRConnection.invoke("SendNotification", message, data);
        console.log("Notification sent via SignalR");
      } catch (error) {
        console.error("Error sending SignalR notification:", error);
      }
    }
  }

  // Connection status
  getConnectionStatus() {
    return {
      signalR: this.isSignalRConnected,
      socketIO: this.isSocketIOConnected,
      overall: this.isSignalRConnected || this.isSocketIOConnected,
    };
  }

  // Disconnect all connections
  async disconnectAll() {
    try {
      if (this.signalRConnection && this.isSignalRConnected) {
        await this.signalRConnection.stop();
        this.isSignalRConnected = false;
      }

      if (this.socketIOConnection && this.isSocketIOConnected) {
        this.socketIOConnection.disconnect();
        this.isSocketIOConnected = false;
      }

      console.log("All socket connections disconnected");
    } catch (error) {
      console.error("Error disconnecting socket connections:", error);
    }
  }

  // Reconnect methods
  async reconnectSignalR(token?: string) {
    if (!this.isSignalRConnected) {
      await this.connectSignalR(token);
    }
  }

  async reconnectSocketIO(token?: string) {
    if (!this.isSocketIOConnected) {
      await this.connectSocketIO(token);
    }
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
