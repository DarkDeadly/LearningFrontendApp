import { Stack } from 'expo-router';

const ClassDetail = () => {
  return (
   <Stack screenOptions={{headerShown : false}}>
    <Stack.Screen name='index' />
    <Stack.Screen name='[courseid]' />
   </Stack>
  );
}

export default ClassDetail;
