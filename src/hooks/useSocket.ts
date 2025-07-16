/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import socketManager, { type AuctionStatusData, type BidData } from "../services/SocketManager";

interface UseSocketOptions {
  autoConnect?: boolean;
  auctionId?: string;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true, auctionId } = options;
  const { user, token } = useSelector((state: any) => state.auth);

  const [connectionStatus, setConnectionStatus] = useState({
    signalR: false,
    socketIO: false,
    overall: false,
  });

  // Initialize connections
  useEffect(() => {
    if (autoConnect && token) {
      socketManager.initializeConnections(token);
    }

    // Update connection status periodically
    const statusInterval = setInterval(() => {
      setConnectionStatus(socketManager.getConnectionStatus());
    }, 2000);

    return () => {
      clearInterval(statusInterval);
    };
  }, [autoConnect, token]);

  // Join/leave auction automatically
  useEffect(() => {
    if (auctionId && connectionStatus.socketIO) {
      socketManager.joinAuction(auctionId);

      return () => {
        socketManager.leaveAuction(auctionId);
      };
    }
  }, [auctionId, connectionStatus.socketIO]);

  // Auction methods
  const joinAuction = useCallback((id: string) => {
    socketManager.joinAuction(id);
  }, []);

  const leaveAuction = useCallback((id: string) => {
    socketManager.leaveAuction(id);
  }, []);

  const placeBid = useCallback(
    (bidData: Omit<BidData, "userId" | "userName">) => {
      if (user) {
        socketManager.placeBid({
          ...bidData,
          userId: user.id,
          userName: user.name || user.username,
        });
      }
    },
    [user]
  );

  // Notification methods
  const sendNotification = useCallback((message: string, data?: any) => {
    socketManager.sendNotification(message, data);
  }, []);

  // Connection control
  const connect = useCallback(() => {
    if (token) {
      socketManager.initializeConnections(token);
    }
  }, [token]);

  const disconnect = useCallback(() => {
    socketManager.disconnectAll();
  }, []);

  const reconnect = useCallback(() => {
    if (token) {
      socketManager.reconnectSignalR(token);
      socketManager.reconnectSocketIO(token);
    }
  }, [token]);

  return {
    // Connection status
    isConnected: connectionStatus.overall,
    isSignalRConnected: connectionStatus.signalR,
    isSocketIOConnected: connectionStatus.socketIO,

    // Auction methods
    joinAuction,
    leaveAuction,
    placeBid,

    // Notification methods
    sendNotification,

    // Connection control
    connect,
    disconnect,
    reconnect,

    // User info
    currentUser: user,
  };
};

// Hook for listening to auction events
export const useAuctionEvents = () => {
  const [newBid, setNewBid] = useState<BidData | null>(null);
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatusData | null>(null);
  const [participantCount, setParticipantCount] = useState<number>(0);

  useEffect(() => {
    const handleNewBid = (event: CustomEvent<BidData>) => {
      setNewBid(event.detail);
    };

    const handleStatusUpdate = (event: CustomEvent<AuctionStatusData>) => {
      setAuctionStatus(event.detail);
    };

    const handleParticipantCount = (event: CustomEvent<{ count: number }>) => {
      setParticipantCount(event.detail.count);
    };

    // Add event listeners
    window.addEventListener("auction-new-bid", handleNewBid as EventListener);
    window.addEventListener("auction-status-update", handleStatusUpdate as EventListener);
    window.addEventListener("auction-participant-count", handleParticipantCount as EventListener);

    return () => {
      // Cleanup event listeners
      window.removeEventListener("auction-new-bid", handleNewBid as EventListener);
      window.removeEventListener("auction-status-update", handleStatusUpdate as EventListener);
      window.removeEventListener(
        "auction-participant-count",
        handleParticipantCount as EventListener
      );
    };
  }, []);

  return {
    newBid,
    auctionStatus,
    participantCount,

    // Clear events
    clearNewBid: () => setNewBid(null),
    clearAuctionStatus: () => setAuctionStatus(null),
  };
};

// Hook for listening to general notifications
export const useNotifications = () => {
  const [signalRNotification, setSignalRNotification] = useState<{
    message: string;
    data: any;
  } | null>(null);
  const [systemUpdate, setSystemUpdate] = useState<any>(null);

  useEffect(() => {
    const handleSignalRNotification = (event: CustomEvent<{ message: string; data: any }>) => {
      setSignalRNotification(event.detail);
    };

    const handleSystemUpdate = (event: CustomEvent<any>) => {
      setSystemUpdate(event.detail);
    };

    // Add event listeners
    window.addEventListener("signalr-notification", handleSignalRNotification as EventListener);
    window.addEventListener("signalr-system-update", handleSystemUpdate as EventListener);

    return () => {
      // Cleanup event listeners
      window.removeEventListener(
        "signalr-notification",
        handleSignalRNotification as EventListener
      );
      window.removeEventListener("signalr-system-update", handleSystemUpdate as EventListener);
    };
  }, []);

  return {
    signalRNotification,
    systemUpdate,

    // Clear notifications
    clearSignalRNotification: () => setSignalRNotification(null),
    clearSystemUpdate: () => setSystemUpdate(null),
  };
};
