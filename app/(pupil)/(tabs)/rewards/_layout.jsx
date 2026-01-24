import { Stack } from 'expo-router';

const RewardsLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='[classid]' />
    </Stack>
  );
}

export default RewardsLayout;
