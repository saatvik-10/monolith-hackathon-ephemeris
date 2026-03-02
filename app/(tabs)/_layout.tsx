import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="tab1"
        options={{
          title: 'Tab1',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipse" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: 'Tab2',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipse" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab3"
        options={{
          title: 'Tab3',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipse" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab4"
        options={{
          title: 'Tab4',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipse" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}