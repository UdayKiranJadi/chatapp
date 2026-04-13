import { useInfiniteQuery } from "@tanstack/react-query";
import { messageService } from "../services/messageService";


export function useMessages(conversationId:string | undefined){
    const query = useInfiniteQuery({
        queryKey:["messages",conversationId],
        queryFn: async ({pageParam}: {pageParam:string}) => {
            if(!conversationId) throw new Error("No conversation selected");
            return messageService.fetchMessages(conversationId, pageParam);

        },
        initialPageParam: undefined,
        getNextPageParam:(lastPage) => {
            return lastPage.hasNext ? lastPage.nextCursor :undefined;

        },
        enabled: !!conversationId,
        staleTime:Infinity,
        refetchOnMount:true,
    })
    return {
        ...query
    }
}