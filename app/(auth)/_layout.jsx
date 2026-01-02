import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack  screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',  // Smooth transitions
        contentStyle: {
          backgroundColor: '#FFFFFF',   // White background for auth screens
        }
      }}>
        <Stack.Screen name='Login' />
        <Stack.Screen name= "Register" />
    </Stack>
  )
}

export default AuthLayout