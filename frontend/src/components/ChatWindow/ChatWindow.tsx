import { useConversationStore } from "../../stores/conversationStore";
import ChatPlaceholder from "./ChatPlaceholder";

const ChatWindow: React.FC = () => {
    const {selectedConversation} = useConversationStore();



    return(
        <div className="min-h-screen w-full bg-white flex flex-col justify-between">
            {!selectedConversation && <ChatPlaceholder/>}
            
             
        </div>
    )
     
}
  
export default ChatWindow;