import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
};

export default RootLayout;
