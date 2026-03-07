import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useWalletStore } from '../store/walletStore';

export function WalletBtn() {
  const { isConnected, isConnecting, pubkey, connect, disconnect } = useWalletStore();

  if (isConnecting) {
    return (
      <View className="flex-row items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
        <ActivityIndicator size="small" color="#14F195" />
        <Text className="text-sm text-solana-text">Connecting...</Text>
      </View>
    );
  }

  if (isConnected && pubkey) {
    return (
      <TouchableOpacity
        className="flex-row items-center gap-2 rounded-lg bg-green-500/20 px-3 py-2"
        onPress={disconnect}>
        <Ionicons name="wallet" size={16} color="#14F195" />
        <Text className="text-sm font-semibold text-solana-teal">
          {pubkey.slice(0, 4)}...{pubkey.slice(-4)}
        </Text>
        <Ionicons name="close-circle" size={14} color="#888" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="flex-row items-center gap-2 rounded-lg bg-white/10 px-3 py-2"
      onPress={connect}>
      <Ionicons name="wallet-outline" size={16} color="#fff" />
      <Text className="text-sm font-semibold text-solana-text">Connect</Text>
    </TouchableOpacity>
  );
}
