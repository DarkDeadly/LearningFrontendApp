import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

const teacherLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='(tabs)' />
    </Stack>
  )
}

export default teacherLayout

const styles = StyleSheet.create({})