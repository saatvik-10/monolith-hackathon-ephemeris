import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, Text, Image, TouchableOpacity } from 'react-native';
import GlassCard from '../common/GlassCard';

type AttendanceCardProps = {
  name: string;
  date: string;
  image: string;
  NFTEnabled: boolean;
  verified?: boolean;
  verifying?: boolean;
  onVerify?: () => void;
};

const AttendanceCard = ({
  name,
  date,
  image,
  NFTEnabled,
  verified = false,
  verifying = false,
  onVerify,
}: AttendanceCardProps) => {
  const getButton = () => {
    if (verified) {
      return (
        <View className="flex-row items-center gap-1 rounded-lg border border-solana-teal bg-solana-teal/10 px-2 py-1">
          <Ionicons name="checkmark-circle" size={14} color="#14F195" />
          <Text className="text-sm font-medium text-solana-teal">Verified</Text>
        </View>
      );
    }
    if (verifying) {
      return (
        <View className="flex-row items-center gap-1 rounded-lg border border-solana-purple/30 bg-solana-purple/10 px-2 py-1">
          <ActivityIndicator size="small" color="#9945FF" />
          <Text className="text-sm font-medium text-solana-purple">Minting...</Text>
        </View>
      );
    }
    if (!NFTEnabled) {
      return (
        <View className="rounded-lg border border-solana-muted/30 px-2 py-1">
          <Text className="text-sm font-medium text-solana-muted">Not verifiable</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={onVerify}
        className="rounded-lg border border-solana-teal bg-solana-teal/10 px-2 py-1">
        <Text className="text-sm font-medium text-solana-teal">Verify</Text>
      </TouchableOpacity>
    );
  };

  return (
    <GlassCard className="mb-3">
      <View className="flex-row">
        <Image source={{ uri: image }} className="h-24 w-24 rounded-xl" resizeMode="cover" />
        <View className="ml-4 flex-1 flex-col justify-between">
          <View>
            <Text className="text-xl font-bold text-white">{name}</Text>
            <Text className="mt-0 text-sm text-solana-teal">{date}</Text>
          </View>
          <View className="items-end">{getButton()}</View>
        </View>
      </View>
    </GlassCard>
  );
};

export default AttendanceCard;
