// app/_layout.tsx
import { getStoredUser, useCurrentUser } from "@/src/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

function Root() {
 const [isAppReady, setIsAppReady] = useState(false);
  const [initialUser, setInitialUser] = useState(undefined);

  useEffect(() => {
    async function prepare() {
      const user = await getStoredUser();
      setInitialUser(user);
      setIsAppReady(true);
    }
    prepare();
  }, []);

  // STEP 2: Pass the loaded user to your hook
  const { data: user } = useCurrentUser(isAppReady ? undefined : initialUser);

  if (!isAppReady) return null;

  const isLoggedIn = !!user;
  const role = user?.role;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The "Why": Because 'user' is immediately available from initialData, 
        there is NO "Bounce" back to Login for already logged-in users.
      */}
      <Stack.Screen 
        name="(auth)" 
        redirect={isLoggedIn} // Native Expo Router redirection logic
      />
      
      <Stack.Screen 
        name="(pupil)" 
        redirect={!isLoggedIn || role !== 'pupil'} 
      />

      <Stack.Screen 
        name="(teacher)" 
        redirect={!isLoggedIn || role !== 'teacher'} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  );
}