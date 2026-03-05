import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WalletBtn } from './WalletBtn';

export function Heading({ title }: { title: string }) {
  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-between">
        <Text className="pl-4 text-3xl font-semibold text-solana-teal">{title}</Text>
        <WalletBtn />
      </View>
    </SafeAreaView>
  );
}
