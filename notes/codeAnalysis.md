# Fetching current User

```Js

export const useCurrentUser = () => {
  const [localUser, setLocalUser] = React.useState(null);
  const [isLoadingLocal, setIsLoadingLocal] = React.useState(true);
  
  // Load user from storage immediately (fast)
  React.useEffect(() => {
    const loadUser = async () => {
      const savedUser = await storage.getUserData();
      setLocalUser(savedUser);
      setIsLoadingLocal(false);
    };
    loadUser();
  }, []);
  
  // Fetch fresh data from API in background
  const { data: freshUser, isLoading: isFetchingFresh } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authAPI.getProfile();
      await storage.saveUserData(response.user);
      setLocalUser(response.user);
      return response.user;
    },
    enabled: !!localUser, // Only fetch if we have a user in storage
    staleTime: 5 * 60 * 1000,
  });
  
  return {
    user: freshUser || localUser,
    isLoading: isLoadingLocal,
    isFetching: isFetchingFresh,
  };
};
```

## Timeline
0ms:   Component mounts
1ms:   useEffect runs
5ms:   AsyncStorage.getItem() completes
6ms:   setLocalUser({ name: "Ahmed", points: 50 })
7ms:   setIsLoadingLocal(false)
8ms:   Screen shows user data! ✅ (very fast)

### Why this is fast:

  * AsyncStorage is on your device (no network)
  * Usually takes 5-10ms
  * User sees data almost instantly
### Understanding enabled: !!localUser:
``` JS
// !! converts value to boolean
!!null       // false
!!undefined  // false
!!{ name }   // true
// So:
enabled: !!localUser
// Means: "Only fetch from API if we have a user in storage"
// Why?
// If no user in storage → User not logged in → Don't call API
// If user in storage → User logged in → Fetch fresh data
```
### Logic
``` JS
// Moment 1: Just mounted
freshUser = undefined
localUser = undefined
user = undefined || undefined = undefined ❌

// Moment 2: Loaded from storage
freshUser = undefined
localUser = { name: "Ahmed", points: 50 }
user = undefined || { ... } = { name: "Ahmed", points: 50 } ✅

// Moment 3: API responded
freshUser = { name: "Ahmed", points: 60 }
localUser = { name: "Ahmed", points: 50 }
user = { points: 60 } || { points: 50 } = { points: 60 } ✅
```
### Flow 

USER OPENS PROFILE SCREEN
         ↓
┌────────────────────────────────────────┐
│  useCurrentUser() Hook Runs            │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  Step 1: Load from AsyncStorage        │
│  Time: ~5ms                             │
│  Result: localUser = { points: 50 }    │
│  Screen: Shows "Points: 50" ✅          │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  Step 2: API Call Starts (Background)  │
│  Time: ~500ms                           │
│  User doesn't notice (data already     │
│  showing from Step 1)                   │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  Step 3: API Responds                  │
│  Result: freshUser = { points: 60 }    │
│  Updates storage & screen               │
│  Screen: Smoothly updates to "60" ✅    │
└────────────────────────────────────────┘