// app/(teacher)/_layout.jsx
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function TeacherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Screen
        name="ClassAdd"
        options={{headerShown : false,
          presentation: 'formSheet', // Android: bottom sheet, iOS: form sheet on supported devices
          animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_bottom',
          headerShown: true,
          title: 'إنشاء فصل جديد',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#6D28D9' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
          headerShadowVisible: false,
          sheetCornerRadius: 16,
          sheetAllowedDetents: [0.8], // 60% of screen height
          // Optional: show grabber on top of sheet
          sheetGrabberVisible: true,
          // No headerLeft to allow default back/swipe

        }}
      />
    </Stack>
  );
}