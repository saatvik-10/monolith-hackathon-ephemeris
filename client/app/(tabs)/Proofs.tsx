import { View, Text } from "react-native";
import ScreenBackground from "../../components/ScreenBackground";
import GlassCard from "../../components/GlassCard";

const Proofs = () => {
  return (
    <ScreenBackground>
      <View className="flex-1 items-center justify-center bg-pink-300">
        <GlassCard>
          <Text className="text-solana-text text-xl font-semibold text-center">
            Proofs
          </Text>
        </GlassCard>
      </View>
    </ScreenBackground>
  );
};

export default Proofs;