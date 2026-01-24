import { Stack } from 'expo-router';

const HistoryLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='index'/>
    </Stack>
  );
}

export default HistoryLayout;
