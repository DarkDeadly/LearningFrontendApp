import { Stack } from 'expo-router'
import { Platform } from 'react-native'

const MaterialLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown : false}} />
        <Stack.Screen name='MaterialAdd'   options={{
                  presentation: 'formSheet',
                  animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_bottom',
                  headerShown: true,
                  title: 'انشاء درس جديد',
                  headerTitleAlign: 'center',
                  headerStyle: { backgroundColor: '#6D28D9' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                  headerShadowVisible: false,
                  sheetCornerRadius: 16,
                  sheetAllowedDetents: [0.6],
                  sheetGrabberVisible: true,
                }}
              />
    </Stack>
  )
}

export default MaterialLayout