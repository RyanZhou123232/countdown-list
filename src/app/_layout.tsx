import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/colors';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ title: 'New countdown' }} />
      </Stack>
    </>
  );
}
