import { View, Text } from "react-native";
import ScreenBackground from "../../components/ScreenBackground";
import GlassCard from "../../components/GlassCard";

const QR = () => {
  return (
    <ScreenBackground>
      <View className="flex-1 items-center justify-center">
        <GlassCard>
          <Text className="text-solana-text text-xl font-semibold text-center">
            QR
          </Text>
        </GlassCard>
      </View>
    </ScreenBackground>
  );
};

export default QR;
