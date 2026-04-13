import { useMessages } from "../../hooks/useMessages";
import { useConversationStore } from "../../stores/conversationStore";


const MessageList: React.FC = () => {
    const {selectedConversation} = useConversationStore();
    const {data, isLoading} = useMessages(selectedConversation?.conversationId);
    const allMessages = data?.pages.slice().flatMap((page) => page.messages) ?? [];

    if(isLoading){
        return <div className="relative flex-1 h-full flex items-center justify-center">
            <div className="size-10 bg-sky-100 rounded-full animate-pulse">


            </div>

        </div>
    }

    console.log(allMessages);
    return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 pb-10">
        {allMessages.map((message) => (
            <div key={message._id}>

            </div>
        ))}


    
    </div>
    )
}

export default MessageList;