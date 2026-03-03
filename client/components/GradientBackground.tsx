import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface GradientBackgroundProps {
  children: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
}) => {
  return (
    <View className="flex-1 bg-solana-dark">
      <View className="absolute inset-0 bg-solana-dark" />

      <LinearGradient
        colors={["rgba(153, 69, 255, 0.35)", "rgba(153, 69, 255, 0)"]}
        style={styles.orbPurpleTop}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <LinearGradient
        colors={["rgba(20, 241, 149, 0.15)", "rgba(20, 241, 149, 0)"]}
        style={styles.orbTealLeft}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />

      <LinearGradient
        colors={[
          "rgba(153, 69, 255, 0.18)",
          "rgba(20, 241, 149, 0.10)",
          "transparent",
        ]}
        style={styles.orbBottomRight}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      />

      <LinearGradient
        colors={["transparent", "rgba(11, 15, 25, 0.6)"]}
        style={styles.vignette}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View className="flex-1 z-[1]">{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  orbPurpleTop: {
    position: "absolute",
    top: -height * 0.12,
    left: width * 0.1,
    width: width * 0.8,
    height: height * 0.45,
    borderRadius: width * 0.4,
    opacity: 0.9,
  },
  orbTealLeft: {
    position: "absolute",
    top: height * 0.35,
    left: -width * 0.25,
    width: width * 0.7,
    height: height * 0.35,
    borderRadius: width * 0.35,
    opacity: 0.8,
  },
  orbBottomRight: {
    position: "absolute",
    bottom: -height * 0.08,
    right: -width * 0.15,
    width: width * 0.75,
    height: height * 0.4,
    borderRadius: width * 0.35,
    opacity: 0.7,
  },

  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GradientBackground;
