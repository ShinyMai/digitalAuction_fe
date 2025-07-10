import * as signalR from "@microsoft/signalr";

const VITE_SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL;

const signalRUrl =
  VITE_SIGNALR_URL ||
  "https://digitalauction.mooo.com/hub/notifications";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(signalRUrl, {
    accessTokenFactory: () => "",
    transport:
      signalR.HttpTransportType.WebSockets |
      signalR.HttpTransportType.LongPolling,
    withCredentials: true,
  })
  .configureLogging(signalR.LogLevel.Information)
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (retryContext) => {
      if (retryContext.previousRetryCount === 0) {
        return 0;
      }
      return Math.min(
        1000 * Math.pow(2, retryContext.previousRetryCount),
        30000
      );
    },
  })
  .build();

// Add error handling for the connection itself
connection.onclose((error) => {
  console.log("SignalR connection closed:", error);
});

connection.onreconnecting((error) => {
  console.log("SignalR reconnecting...", error);
});

connection.onreconnected((connectionId) => {
  console.log("SignalR reconnected with ID:", connectionId);
});

export default connection;
