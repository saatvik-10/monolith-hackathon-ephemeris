import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <View className={`rounded-2xl p-px overflow-hidden ${className ?? ""}`}>
      <LinearGradient
        colors={["rgba(153, 69, 255, 0.5)", "rgba(20, 241, 149, 0.3)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="rounded-[15px] p-4 bg-[rgba(19,17,28,0.75)]">{children}</View>
    </View>
  );
};

export default GlassCard;
