import { View, Text, Image, Pressable } from "react-native";
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
    <GlassCard style={{ marginBottom: 12 }}>

      <View className="flex-row">

        {/* Image */}
        <Image
          source={{ uri: image }}
          className="w-24 h-28 rounded-xl"
          resizeMode="cover"
        />

        {/* Right Section */}
        <View className="flex-1 ml-4 justify-between">

          {/* Text */}
          <View>
            <Text className="text-white text-base font-semibold text-lg">
              {name}
            </Text>

            <Text className="text-white/60 text-sm mt-0">
              {date}
            </Text>
          </View>

          {/* Bottom Right Button */}
          <View className="items-end mt-4">
            <Pressable
              disabled={!NFTEnabled}
              onPress={NFTEnabled ? onVerify : undefined}
              className={`px-4 py-2 rounded-lg border ${
                NFTEnabled
                  ? "border-green-500 bg-green-500/10"
                  : "border-white/30"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  NFTEnabled
                    ? "text-green-400"
                    : "text-white/40"
                }`}
              >
                {NFTEnabled ? "Verify" : "Not verifiable"}
              </Text>
            </Pressable>
          </View>

        </View>

      </View>

    </GlassCard>
  );
};

export default AC2;