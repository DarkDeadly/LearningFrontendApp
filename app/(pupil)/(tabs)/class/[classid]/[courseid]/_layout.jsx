import { Stack } from 'expo-router';

const CourseLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name = 'index' /> 
    </Stack>
  );
}

export default CourseLayout;
