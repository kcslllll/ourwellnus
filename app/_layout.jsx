import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth";

// disable swiping action : { gestureEnabled: false }
export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false, gestureEnabled: false}} />
        </AuthProvider>
    )
}



