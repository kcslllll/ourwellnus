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
        async function fetchUser() {
        // find user in doctor list, if error, user is a therapist
            //console.log(user.id);
            const { data } = await supabase.from('uhc_doctors').select('username').eq('user_id', user.id);
            if (data.length === 0) {
                //console.log(data);
                router.replace('/therapistConsultation');
            } else {
                //console.log(data);
                router.replace("/doctorHome");
            }
        }
        // Bringing the user to the page they are supposed to be in
        console.log('useProtectedRoute useEffect called');
        const inAuthGroup = segments[0] === "(auth)";
        if (user == null && !inAuthGroup) {
            router.replace("/userIdentity");
        } else if (user != null && inAuthGroup) {
            if (user.email.slice(-10) == '@u.nus.edu') {
                // user is a NUS student
                router.replace("/summary");
            } else {
                fetchUser();
            }
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