import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.outer, style]}>
      <LinearGradient
        colors={["rgba(153, 69, 255, 0.5)", "rgba(20, 241, 149, 0.3)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGradient}
      />

      <View style={styles.inner}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 16,
    padding: 1,
    overflow: "hidden",
  },
  borderGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  inner: {
    backgroundColor: "rgba(19, 17, 28, 0.75)",
    borderRadius: 15,
    padding: 16,
  },
});

export default GlassCard;
