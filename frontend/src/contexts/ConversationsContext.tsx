import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../stores/authStore";
import { useConversations } from "../hooks/useConversations";
import { useSocketContext } from "./SocketContext";
import { toast } from "sonner";

export type Conversation = {
  conversationId: string;
  friend: User & {
    online: boolean;
  };
  unreadCounts: Record<string, number>;
  lastMessage: {
    content: string;
    timestamp: Date;
  } | null;
};

type ConversationsContextType = {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  isError: boolean;
};

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export const useConversationsContext = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error("useConversationsContext must be used within ConversationsProvider");
  }
  return context;
};

export const ConversationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, isError } = useConversations();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const {socket} = useSocketContext();   
  

  useEffect(() => {
    if (data) setConversations(data.data);
  }, [data]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationOnlineStatus = ({friendId, username, online}:{friendId:string, username:string, online:boolean}) =>{
    setConversations((prev) => {
      return prev.map((conversation) => {
        if(conversation.friend.id === friendId){
          if(conversation.friend.online != online){
            toast.info(`${username} is ${online ? "online": "offline"} `);
          }
          return {...conversation, friend:{...conversation.friend, online}};

        }
        return conversation;
      })
    })
  }



  useEffect(() => {
    socket?.on("conversation:online-status",handleConversationOnlineStatus);
    return () => {
      socket?.off("conversation:online-status",handleConversationOnlineStatus);

    }
  },[socket])

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        filteredConversations,
        searchTerm,
        setSearchTerm,
        isLoading,
        isError,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};