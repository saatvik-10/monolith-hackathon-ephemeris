import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";

export default function TabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="absolute bottom-6 left-6 right-6">
      <BlurView
        intensity={100}
        tint="dark"
        className="flex-row justify-between items-center px-6 py-4 rounded-3xl bg-white/5 border border-white/10 overflow-hidden"
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className="flex-1 items-center"
            >
              <Text
                className={`text-sm ${
                  isFocused
                    ? "text-emerald-400 font-semibold"
                    : "text-white/60"
                }`}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}
