// app/_layout.tsx
import { useCurrentUser } from "@/src/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Separate component that uses the hook
function Root() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return null; // or your SplashScreen component
  }

  const isLoggedIn = !!user;
  const role = user?.role;
  console.log(`the value of isLoggedIN is ${isLoggedIn} and the role is ${role}`)

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />        
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn && role === 'pupil'}>
        <Stack.Screen name="(pupil)" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn && role === 'teacher'}>
        <Stack.Screen name="(teacher)" />
      </Stack.Protected>
    </Stack>
  );
}

// Main layout just provides the client and renders the inner component
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  );
}