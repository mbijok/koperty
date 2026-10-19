import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Budget data changes only through user actions; avoid refetch storms on tab focus.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
