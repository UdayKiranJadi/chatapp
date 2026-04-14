import { useInfiniteQuery } from "@tanstack/react-query";
import { messageService, type MessagesResponse } from "../services/messageService";
import { useCallback, type RefObject } from "react";

export function useMessages(
  conversationId: string | undefined,
  containerRef: RefObject<HTMLDivElement | null>
) {
  const query = useInfiniteQuery<MessagesResponse, Error>({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }) => {
      if (!conversationId) throw new Error("No conversation selected");
      return messageService.fetchMessages(
        conversationId,
        pageParam as string | undefined
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!conversationId,
    staleTime: Infinity,
    refetchOnMount: true,
  });

  const handleLoadMore = useCallback(async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;

    try {
      await query.fetchNextPage();

      setTimeout(() => {
        const currentContainer = containerRef.current;
        if (currentContainer) {
          const scrollHeightAfter = currentContainer.scrollHeight;
          currentContainer.scrollTop =
            scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
        }
      }, 0);
    } catch (error) {
      console.error("Error loading more messages:", error);
    }
  }, [containerRef, query]);

  return {
    ...query,
    handleLoadMore,
  };
}