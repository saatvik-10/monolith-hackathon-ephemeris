import { View, Text, Image, TouchableOpacity } from "react-native";
import GlassCard from "./GlassCard";

type AttendanceCardProps = {
  name: string;
  date: string;
  image: string;
  NFTEnabled: boolean;
  onVerify?: () => void;
};

const AC2 = ({
  name,
  date,
  image,
  NFTEnabled,
  onVerify,
}: AttendanceCardProps) => {
  return (
    <GlassCard className="mb-2">
      <View className="flex-row">
        <Image
          source={{ uri: image }}
          className="w-24 h-24 rounded-xl"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 flex-col justify-between">
          <View>
            <Text className="text-white font-semibold text-lg">
              {name}
            </Text>
            <Text className="text-white/60 text-xs mt-0">
              {date}
            </Text>
          </View>
          <View className="items-end">
            <TouchableOpacity
              disabled={!NFTEnabled}
              onPress={NFTEnabled ? onVerify : undefined}
              className={`px-2 py-1 rounded-lg border ${
                NFTEnabled
                  ? "border-solana-teal bg-solana-teal/10"
                  : "border-solana-muted/30"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  NFTEnabled
                    ? "text-solana-teal"
                    : "text-solana-muted"
                }`}
              >
                {NFTEnabled ? "Verify" : "Not verifiable"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

    </GlassCard>
  );
};

export default AC2;