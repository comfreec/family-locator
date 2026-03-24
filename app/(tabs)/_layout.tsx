import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: '지도',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🗺️</Text>,
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: '가족',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👨‍👩‍👧‍👦</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
