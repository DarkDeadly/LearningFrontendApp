import { Stack } from 'expo-router';

const classLayout = () => {
  return (
   <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='[classid]' />
   </Stack>
  );
}

export default classLayout;
