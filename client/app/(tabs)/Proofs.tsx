import { useCallback, useState } from 'react';
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/screen/ScreenBackground';
import GlassCard from '../../components/common/GlassCard';
import { Heading } from '../../components/common/Heading';
import { verifiedEventsStorage, VerifiedEvent } from '@/utils/attendance';

const ProofCard = ({ item }: { item: VerifiedEvent }) => (
  <GlassCard className="mb-3">
    <View className="flex-row">
      <Image source={{ uri: item.image }} className="h-24 w-24 rounded-xl" resizeMode="cover" />
      <View className="ml-4 flex-1 justify-between">
        <View>
          <Text className="text-lg font-bold text-solana-text">{item.name}</Text>
          <Text className="mt-0.5 text-sm text-solana-teal">{item.startDate}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="checkmark-circle" size={14} color="#14F195" />
          <Text className="text-xs text-solana-teal">Verified on-chain</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(`https://explorer.solana.com/address/${item.mintAddress}?cluster=devnet`)
      }>
      <View className="mt-3 rounded-lg border border-solana-text/10 bg-solana-text/5 px-3 py-2">
        <View className="flex-row items-center">
          <Text className="text-xs text-solana-muted">Mint Address</Text>
          <Ionicons name="open-outline" size={10} color="#14F195" style={{ marginLeft: 8 }} />
        </View>
        <Text
          className="mt-0.5 text-xs text-solana-teal"
          style={{ fontFamily: 'monospace' }}
          numberOfLines={1}>
          {item.mintAddress || 'Pending...'}
        </Text>
      </View>
    </TouchableOpacity>
    <View className="mt-2 flex-row justify-between">
      <View>
        <Text className="text-xs text-solana-muted">Wallet</Text>
        <Text
          className="text-xs text-solana-text/70"
          style={{ fontFamily: 'monospace' }}
          numberOfLines={1}>
          {item.walletAddress
            ? `${item.walletAddress.slice(0, 6)}...${item.walletAddress.slice(-4)}`
            : '—'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-xs text-solana-muted">Verified</Text>
        <Text className="text-xs text-solana-text/70">
          {new Date(item.verifiedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  </GlassCard>
);

const Proofs = () => {
  const [verifiedEvents, setVerifiedEvents] = useState<VerifiedEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      verifiedEventsStorage.getAll().then(setVerifiedEvents);
    }, [])
  );

  return (
    <ScreenBackground>
      <Heading title="Proofs" />
      {verifiedEvents.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="receipt-outline" size={48} color="#6B7280" />
          <Text className="mt-4 text-center text-base text-solana-muted">
            No verified attendances yet. Verify an attendance from the Attendance tab to mint your
            proof NFT.
          </Text>
        </View>
      ) : (
        <FlatList
          data={verifiedEvents}
          keyExtractor={(item) => item.eventId}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProofCard item={item} />}
        />
      )}
    </ScreenBackground>
  );
};

export default Proofs;
