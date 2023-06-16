
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useRouter, useSegments } from 'expo-router';

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Bringing the user to the page they are supposed to be in
        console.log('useProtectedRoute useEffect called');
        const inAuthGroup = segments[0] === "(auth)";
        if (user == null && !inAuthGroup) {
            router.replace("/login");
        } else if (user != null && inAuthGroup) {
            router.replace("/summary");
        }
        
    }, [router, segments, user]) // useEffect will only run if user status changes

}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    useProtectedRoute(user);

    useEffect(() => {
        console.log(`AuthProvider useEffect called`);
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            // helps us obtain data of active users of the app
            console.log(`onAuthStateChange event: ${event}`);
            if (event === "SIGNED_IN") {
                setUser(session.user);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            } else if (event === "PASSWORD_RECOVERY") {
                setUser(session.user);
            }
        }) 
        return () => data.subscription.unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</ AuthContext.Provider>
}