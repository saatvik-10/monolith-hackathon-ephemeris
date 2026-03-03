import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "200",
          marginTop: 0,
          marginBottom: -4,
        },
        sceneStyle: { backgroundColor: "transparent" },
        tabBarActiveTintColor: "#14F195",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          marginHorizontal: 16,
          height: 70,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 6,
        },

        tabBarBackground: () => (
          <View
            className="flex-1 rounded-2xl overflow-hidden bg-white/[0.12] border border-white/[0.15]"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <BlurView
              intensity={100}
              tint="dark"
              className="absolute inset-0"
            />

            <LinearGradient
              colors={[
                "rgba(255,255,255,0.25)",
                "rgba(255,255,255,0.05)"
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.75, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="Events"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="QR"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "checkmark-circle" : "checkmark-circle-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Attendance"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "shield-checkmark" : "shield-checkmark-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Proofs"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;