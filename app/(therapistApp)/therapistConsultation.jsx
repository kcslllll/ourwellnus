import { Text, View, StyleSheet, Alert, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/auth";

export default function TherapistConsultation() {
    const { user } = useAuth();
    const router = useRouter();
    const [doctorName, setDoctorName] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    // Displays name of user at the top of the home page
    useEffect(() => {
        let ignore = false;

        if (user === null) {
            ignore = true;
        }

        async function FetchName() {
            if (!ignore) {
                const { data } = await supabase.from('ucs_therapists').select('username').eq('user_id', user.id);
                //console.log(data);
                setDoctorName(data[0].username);
            }
        }

        FetchName();
    },[user])

    const [queue, setQueue] = useState(null);

    // Shows number of people in the queue for physical health consultations
    useEffect(() => {
        async function fetchQueue() {
            const { count } = await supabase
                .from('mental_queue')
                .select('id', { count: 'exact' })
                .eq('doctor_chosen', doctorName);
            setQueue(count);
        }
        fetchQueue();
    });

    // only allow consultations when there are people in the queue
    // if queue length === 0, show an alert
    const handleStartConsult = async () => {
        if (queue === 0) {
            Alert.alert(
                'Unable to start consultation',
                'There is nobody in the queue!',
                [{
                    text: 'OK',
                }]
            )
        } else {
            router.push('/therapistStart');
        }
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <ScrollView
                contentContainerStyle={styles.pageContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Button style={styles.logoutContainer} onPress={() => supabase.auth.signOut()}>Logout</Button>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.nameText}>{doctorName},</Text>
                <View style={styles.roundedContainer}>
                    <Text style={styles.roundedText}>Number of people in queue:</Text>
                    <View style={styles.roundedRectangle}>
                        <Text style={styles.numberText}>{queue}</Text>
                    </View>
                    <Button
                        mode='contained'
                        style={{ marginTop: 50 }}
                        labelStyle={{ fontSize: 18 }}
                        onPress={handleStartConsult}
                    >
                        Start Consultation
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    backContainer: {
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
        marginTop: 10,
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