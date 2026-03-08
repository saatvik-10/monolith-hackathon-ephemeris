import { useCallback, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/screen/ScreenBackground';
import AttendanceCard from '../../components/attendance/AttendanceCard';
import { Heading } from '../../components/common/Heading';
import { useWalletStore } from '@/components/store/walletStore';
import { issueReceipt, mintNFT } from '@/lib/api';
import { tokenStorage } from '@/utils/token';
import { attendedEventsStorage, verifiedEventsStorage, AttendedEvent } from '@/utils/attendance';

const Attendance = () => {
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const { pubkey, connect } = useWalletStore();

  useFocusEffect(
    useCallback(() => {
      attendedEventsStorage.getAll().then(setAttendedEvents);
      verifiedEventsStorage.getAll().then((verified) => {
        setVerifiedIds(new Set(verified.map((v) => v.eventId)));
      });
    }, [])
  );

  const handleVerify = async (event: AttendedEvent) => {
    let walletAddress = pubkey;

    if (!walletAddress) {
      try {
        await connect();
        walletAddress = useWalletStore.getState().pubkey;
      } catch {}

      if (!walletAddress) {
        Alert.alert(
          'Wallet Required',
          'You need to connect your wallet to mint the attendance NFT.'
        );
        return;
      }
    }

    setVerifyingId(event.eventId);

    try {
      await tokenStorage.save(event.token);

      const receipt = await issueReceipt({
        description: `Attendance at ${event.name}`,
      });

      const result = await mintNFT(receipt.id, {
        walletAddress,
      });

      await verifiedEventsStorage.add({
        eventId: event.eventId,
        name: event.name,
        image: event.image,
        startDate: event.startDate,
        attendedAt: event.attendedAt,
        verifiedAt: new Date().toISOString(),
        mintAddress: (result as any).nft?.mintAddress ?? '',
        walletAddress,
      });

      setVerifiedIds((prev) => new Set(prev).add(event.eventId));

      Alert.alert(
        'Attendance Verified!',
        'Your NFT has been minted. Check the Proofs tab to see it.'
      );
    } catch {
      Alert.alert('Error', 'Failed to verify attendance');
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <ScreenBackground>
      <Heading title={'Attendance'} />
      {attendedEvents.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="receipt-outline" size={48} color="#6B7280" />
          <Text className="mt-4 text-center text-base text-solana-muted">
            No attended events yet. Scan an event QR code to mark your attendance.
          </Text>
        </View>
      ) : (
        <FlatList
          data={attendedEvents}
          keyExtractor={(item) => item.eventId}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AttendanceCard
              name={item.name}
              date={item.startDate}
              image={item.image}
              NFTEnabled={item.nftEnabled}
              verified={verifiedIds.has(item.eventId)}
              verifying={verifyingId === item.eventId}
              onVerify={() => handleVerify(item)}
            />
          )}
        />
      )}
    </ScreenBackground>
  );
};

export default Attendance;
