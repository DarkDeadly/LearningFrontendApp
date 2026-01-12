// (teacher)/(tabs)/classes/[id]/_layout.jsx


import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Screen
        name="courseAdd"
        options={{
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
          sheetAllowedDetents: [0.8],
          sheetGrabberVisible: true,
        }}
      />

      <Stack.Screen
        name="points"
        options={{ headerShown: false }}
      />
      <Stack.Screen name='[courseId]' options={{headerShown : false}}/>
    </Stack>
  );
}