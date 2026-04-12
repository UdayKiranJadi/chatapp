import type React from "react"
import { EllipsisVertical } from "lucide-react";
import { useConversationStore } from "../../stores/conversationStore";

const ChatHeader: React.FC = () => {
    const {selectedConversation} = useConversationStore();


    return <>
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <img src="https://testingbot.com/free-online-tools/random-avatar/300" alt="user Image" className="size-0 rounded-full object-cover"/>
            <div>
                <h2 className="font-semibold">{conversation?.friend?.username}</h2>
                <p className={`${conveersation?.friend.online ? "text-sm text-green-500" : 'text-sm text-gray-500'}`}>
                    {conversation?.friend.online ? 'online': 'Offline'}
                </p>
            </div>

        </div>
        
    </div>

    </>
}

export default ChatHeader;