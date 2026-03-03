import "./global.css";
import { Stack } from "expo-router";
import GradientBackground from "../components/GradientBackground";

export default function RootLayout() {
  return (
    <GradientBackground>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </GradientBackground>
  );
}
