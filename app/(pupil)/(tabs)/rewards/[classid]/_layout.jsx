import { Stack } from 'expo-router';

const ClassRewardLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='index'/>
    </Stack>
  );
}

export default ClassRewardLayout;
