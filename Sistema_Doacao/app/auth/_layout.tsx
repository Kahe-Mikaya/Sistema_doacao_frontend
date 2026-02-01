import { Stack } from 'expo-router';
import { RegisterProvider } from '@/contexts/RegisterContext';

export default function AuthLayout() {
  return (
    <RegisterProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="donation" options={{ headerShown: false }} />
      </Stack>
    </RegisterProvider>
  );
}