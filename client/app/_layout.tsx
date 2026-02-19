import { Stack } from "expo-router";
import GradientBackground from "../components/gradientBackground";

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
