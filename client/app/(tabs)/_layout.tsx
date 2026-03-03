import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../global.css"

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#14F195",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "rgba(11, 15, 25, 0.85)",
          borderTopWidth: 0.5,
          borderTopColor: "rgba(153, 69, 255, 0.2)",
          height: 70,
          paddingBottom: 10,
        },
        sceneStyle: { backgroundColor: "transparent" },
      }}
    >
      <Tabs.Screen
        name="Events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "checkmark-circle" : "checkmark-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Proofs"
        options={{
          title: "Proofs",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "shield-checkmark" : "shield-checkmark-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Receipts"
        options={{
          title: "Receipts",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;