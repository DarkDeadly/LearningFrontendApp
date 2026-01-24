import { Stack } from 'expo-router';
import { Platform } from 'react-native';

const RewardListLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name ='Addrewards' 
         options={{
                  presentation: 'formSheet',
                  animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_bottom',
                  headerShown: true,
                  headerTitleAlign: 'center',
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                  headerShadowVisible: false,
                  sheetCornerRadius: 16,
                  sheetAllowedDetents: [0.8],
                  sheetGrabberVisible: true,
                }}
        />
        <Stack.Screen name = 'PupilHistory' />
        <Stack.Screen name = '[pupilId]'  options={{
                  presentation: 'formSheet',
                  animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_bottom',
                  headerShown: true,
                  headerTitleAlign: 'center',
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                  headerShadowVisible: false,
                  sheetCornerRadius: 16,
                  sheetAllowedDetents: [0.8],
                  sheetGrabberVisible: true,
                }} />
    </Stack>
  );
}

export default RewardListLayout;
