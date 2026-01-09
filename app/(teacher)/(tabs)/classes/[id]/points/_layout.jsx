// (teacher)/(tabs)/classes/[id]/points/_layout.jsx


import { Stack } from 'expo-router'

const PointLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='PointManagement'/>

    </Stack>
  )
}

export default PointLayout