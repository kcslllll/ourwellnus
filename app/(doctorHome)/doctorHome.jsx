import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";

export default function DoctorHome() {
    const {user} = useAuth();
    const [doctorName, setDoctorName] = useState('')

    // Should change based on the username
    useEffect(() => {
        let ignore = false;

        if (user === null) {
            ignore = true;
        }

        async function FetchName() {
            if (!ignore) {
                const {data} = await supabase.from('uhc_doctors').select('username').eq('user_id', user.id);
                //console.log(data)
                setDoctorName(data[0].username);
            }
        }
        
        FetchName();
    })    

    const [queue, setQueue] = useState(null);

    useEffect(() => {
        async function fetchQueue() {
            const { count } = await supabase
                .from('physical_queue')
                .select('id', {count: 'exact'});
            setQueue(count);
        }
        fetchQueue();
    });

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Button style={styles.logoutContainer} onPress={() => supabase.auth.signOut()}>Logout</Button>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.nameText}>{doctorName},</Text>
            <View style={styles.roundedContainer}>
                <Text style={styles.roundedText}>Number of people in queue:</Text>
                <View style={styles.roundedRectangle}>
                    <Text style={styles.numberText}>{ queue }</Text>
                </View>
                <Link href='/doctorStart' asChild>
                    <Button mode='contained' style={{ marginTop: 50 }} labelStyle={{ fontSize: 18 }}>
                        Start Consultation
                    </Button>
                </Link>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    logoutContainer: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20
    },
    welcomeText: {
        padding: 20,
        fontSize: 20
    },
    nameText: {
        paddingHorizontal: 20,
        fontSize: 38,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
    },
    roundedContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        margin: 20,
        marginTop: 50,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    roundedText: {
        fontSize: 18,
    },
    roundedRectangle: {
        marginTop: 40,
        width: 130,
        height: 110,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center'
    },
    numberText: {
        fontSize: 80,
        color: '#8000FF',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
    }
})