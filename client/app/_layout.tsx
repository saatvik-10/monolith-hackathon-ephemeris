import { useWalletStore } from '@/components/store/walletStore';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import GradientBackground from '../components/screen/GradientBackground';
import './global.css';

export default function RootLayout() {
  const restoreWallet = useWalletStore((st) => st.restoreWallet);

  useEffect(() => {
    restoreWallet();
  }, [restoreWallet]);

  return (
    <GradientBackground>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </GradientBackground>
  );
}
