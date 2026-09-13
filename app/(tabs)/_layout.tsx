import { Home } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';

export default function TabLayout() {
  const { theme } = useUniwind();

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size ?? 24} />,
          }}
        />
      </Tabs>
    </>
  );
}
