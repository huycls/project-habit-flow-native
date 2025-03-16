import { Tabs } from 'expo-router';
import { Chrome as Home, ChartBar as BarChart2, Users, Settings, SquarePlus } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings';

export default function TabLayout() {
  const { theme } = useSettingsStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondaryText,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
       <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ size, color }) => <BarChart2 size={size} color={color} />,
        }}
      />
       <Tabs.Screen
        name="add-habit"
        options={{
          title: 'Add',
          tabBarIcon: ({ size, color }) => <SquarePlus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}