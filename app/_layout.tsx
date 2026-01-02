import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
export default function RootLayout() {
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      // How long data stays "fresh" (won't refetch)
      staleTime: 5 * 60 * 1000,  // 5 minutes
           
      // Retry failed requests
      retry: 2,
      
      // Don't refetch when window regains focus (mobile doesn't need this)
      refetchOnWindowFocus: false,
      
      // Don't refetch when component remounts
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
  return (
  <QueryClientProvider client={queryClient}>
    <Stack screenOptions={{headerShown : false}} >
    <Stack.Screen name="index" /> 
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(pupil)"/>
    <Stack.Screen name="(teacher)"/>
  </Stack>
  </QueryClientProvider>
  )
}
