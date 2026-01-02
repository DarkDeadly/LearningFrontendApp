import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

const tabsScreens = () => {
  return (
    <Tabs 
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
        <Tabs.Screen 
         options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
        name='home' />
        <Tabs.Screen 
         options={{
          title: 'قسمي',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
        name='class' />
        <Tabs.Screen 
        options={{
          title: 'المكافآت',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
        name='rewards' />
        <Tabs.Screen 
         options={{
          title: 'الملف الشخصي',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
        name='profile' />
    </Tabs>
  )
}

export default tabsScreens