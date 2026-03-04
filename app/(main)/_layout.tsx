import { Stack } from 'expo-router/stack';

export default function MainLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        </Stack>
    );
}
