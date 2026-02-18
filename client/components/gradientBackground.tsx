import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  children: React.ReactNode;
}

export default function GradientBackground({ children }: Props) {
  return (
    <View className="flex-1 bg-black">
      {/* Base Dark Layer */}
      <LinearGradient
        colors={["#000000", "#0B1120", "#000000"]}
        className="absolute inset-0"
      />

      {/* Solana Inspired Glow */}
      <LinearGradient
        colors={[
          "rgba(0,255,163,0.15)",   // neon green
          "rgba(147,51,234,0.15)",  // purple
          "rgba(59,130,246,0.12)",  // blue
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      {children}
    </View>
  );
}
