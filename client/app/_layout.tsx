import './global.css';
import { Stack } from 'expo-router';
import GradientBackground from '../components/screen/GradientBackground';
// import { useWalletStore } from '@/components/store/walletStore';
import { useEffect } from 'react';

export default function RootLayout() {
  // const restoreWallet = useWalletStore((st) => st.restoreWallet);

  // useEffect(() => {
  //   restoreWallet();
  // }, [restoreWallet]);

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
