import { View, Text, Image, TouchableOpacity } from 'react-native';
import GlassCard from '../common/GlassCard';

type AttendanceCardProps = {
  name: string;
  date: string;
  image: string;
  NFTEnabled: boolean;
  onVerify?: () => void;
};

const AttendanceCard = ({ name, date, image, NFTEnabled, onVerify }: AttendanceCardProps) => {
  return (
    <GlassCard className="mb-3">
      <View className="flex-row">
        <Image source={{ uri: image }} className="h-24 w-24 rounded-xl" resizeMode="cover" />
        <View className="ml-4 flex-1 flex-col justify-between">
          <View>
            <Text className="text-xl font-bold text-white">{name}</Text>
            <Text className="mt-0 text-sm text-solana-teal">{date}</Text>
          </View>
          <View className="items-end">
            <TouchableOpacity
              disabled={!NFTEnabled}
              onPress={NFTEnabled ? onVerify : undefined}
              className={`rounded-lg border px-2 py-1 ${
                NFTEnabled ? 'border-solana-teal bg-solana-teal/10' : 'border-solana-muted/30'
              }`}>
              <Text
                className={`text-sm font-medium ${
                  NFTEnabled ? 'text-solana-teal' : 'text-solana-muted'
                }`}>
                {NFTEnabled ? 'Verify' : 'Not verifiable'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

export default AttendanceCard;
