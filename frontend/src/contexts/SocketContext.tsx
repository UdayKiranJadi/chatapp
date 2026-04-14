import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuthStore } from "../stores/authStore";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    const socketClient = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      auth: {
        token,
      },
      reconnectionAttempts: 1,
      transports: ["websocket", "polling"],
    });

    setSocket(socketClient);

    socketClient.on("connect", () => {
      console.log("Socket connected", socketClient.id);
    });

    socketClient.on("connect_error", (error) => {
      console.error("Connection error", error);
      toast.error(error.message || "Socket connection error");
    });

    socketClient.on("internal_error", (error) => {
      console.error("Internal error", error);
      toast.error("Socket connection error");
    });

    return () => {
      socketClient.off("connect");
      socketClient.off("connect_error");
      socketClient.off("internal_error");
      socketClient.disconnect();
      setSocket(null);
    };
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};