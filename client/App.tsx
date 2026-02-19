import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import TabBar from "./components/TabBar";

const Tab = createBottomTabNavigator();

const Screen = ({ title }: { title: string }) => (
  <View className="flex-1 bg-neutral-900 justify-center items-center">
    <Text className="text-white text-2xl">{title}</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen name="Home">
          {() => <Screen title="Home" />}
        </Tab.Screen>
        <Tab.Screen name="Search">
          {() => <Screen title="Search" />}
        </Tab.Screen>
        <Tab.Screen name="Activity">
          {() => <Screen title="Activity" />}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {() => <Screen title="Profile" />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
