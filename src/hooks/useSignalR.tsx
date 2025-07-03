// src/hooks/useSignalR.ts
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";

interface SignalRHook {
    connection: HubConnection | null;
    isConnected: boolean;
}

const useSignalR = (url: string): SignalRHook => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(url) // URL của SignalR Hub, ví dụ: "https://your-server.com/auctionhub"
            .configureLogging(LogLevel.Information)
            .build();

        newConnection
            .start()
            .then(() => {
                console.log("Connected to SignalR Hub");
                setIsConnected(true);
            })
            .catch((error) => console.error("Connection failed:", error));

        setConnection(newConnection);

        // Xử lý khi kết nối bị ngắt
        newConnection.onclose(() => {
            setIsConnected(false);
            console.log("Disconnected. Attempting to reconnect...");
            setTimeout(() => newConnection.start(), 2000); // Tự động kết nối lại sau 2 giây
        });

        // Cleanup khi component unmount
        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [url]);

    return { connection, isConnected };
};

export default useSignalR;