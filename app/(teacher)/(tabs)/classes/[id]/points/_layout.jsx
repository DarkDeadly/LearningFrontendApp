// (teacher)/(tabs)/classes/[id]/points/_layout.jsx


import { Stack } from 'expo-router'
import { Platform } from 'react-native'

const PointLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='PointManagement'/>
        <Stack.Screen name = "HistoryScreen" 
        options={{
                  presentation: 'formSheet',
                  animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_bottom',
                  headerShown: true,
                  title: 'سجل النقاط للتلميذ',
                  headerTitleAlign: 'center',
                  headerStyle: { backgroundColor: '#6D28D9' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                  headerShadowVisible: false,
                  sheetCornerRadius: 16,
                  sheetAllowedDetents: [0.8],
                  sheetGrabberVisible: true,
                }}
        />

    </Stack>
  )
}

export default PointLayout