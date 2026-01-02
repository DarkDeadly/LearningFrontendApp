import { Stack } from 'expo-router'

const pupilLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='(tabs)' />
    </Stack>
  )
}

export default pupilLayout