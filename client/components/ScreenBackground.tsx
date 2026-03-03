import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children }) => {
  return (
    <View className="flex-1 bg-transparent">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 px-4">{children}</SafeAreaView>
    </View>
  );
};

export default ScreenBackground;
