import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";


export default function MentalQueue() {
    const router = useRouter();
    const param = useLocalSearchParams();
    const [queue, setQueue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [shorterQ, setShorterQ] = useState('');
    const [firstQ, setFirstQ] = useState('');
    const [secondQ, setSecondQ] = useState('');

    const { user } = useAuth();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);


    // Fetch the number of people in a queue (based on doctor chosen)
    useEffect(() => {
        async function fetchQueue() {
            const { count } = await supabase
                .from('mental_queue')
                .select('id', { count: 'exact' })
                .eq('doctor_chosen', param.name);
            //console.log(count);
            setQueue(count);
        }
        async function fetchFirstQ() {
            const { count } = await supabase
                .from('mental_queue')
                .select('id', { count: 'exact' })
                .eq('doctor_chosen', 'Dr. Chan Boo Chan');
            //console.log(count);
            setFirstQ(count);
        }
        async function fetchSecondQ() {
            const { count } = await supabase
                .from('mental_queue')
                .select('id', { count: 'exact' })
                .eq('doctor_chosen', 'Dr. Goh Chee Yen');
            //console.log(count);
            setSecondQ(count);
        }
        if (param.name == 'No Preference') {
            // user did not specify their preferred doctor
            fetchFirstQ();
            fetchSecondQ();
            // set queue as the shorter one
            if (firstQ <= secondQ) {
                setShorterQ('Dr. Chan Boo Chan');
                setQueue(firstQ);
            } else {
                setShorterQ('Dr. Goh Chee Yen');
                setQueue(secondQ);
            }
        } else {
            // user have specified the doctor they prefer
            fetchQueue();
        }
    }, [refreshing, param.name, firstQ, secondQ, router]);


    const handleJoinQueue = async () => {
        // Add user to queue table in database
        setLoading(true);
        if (param.name == 'No Preference') {
            // insert into first queue
            const { error } = await supabase
                .from('mental_queue')
                .insert({ user_id: user.id, doctor_chosen: shorterQ, issue_stated: param.issue });
            if (error) {
                console.log(error.message);
            }
        } else {
            const { error } = await supabase
                .from('mental_queue')
                .insert({ user_id: user.id, doctor_chosen: param.name, issue_stated: param.issue });
            if (error) {
                console.log(error.message);
            }
        }
        setLoading(false);
        return;
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
                <Pressable style={styles.backContainer} onPressIn={() => router.back()}>
                    <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
                </Pressable>
                <Text style={styles.headerText}>Mental Health Consultation</Text>
                <View style={styles.confirmationContainer}>
                    <Text style={styles.confirmationText}>Confirmation:</Text>
                    <Text style={{ marginTop: 10, fontSize: 16 }}>Doctor: {param.name}</Text>
                    <Text style={{ marginTop: 5, fontSize: 16 }}>Consultation on: {param.issue}</Text>
                </View>
                <Text style={styles.subHeaderText}>Number of people in queue:</Text>
                <View style={styles.roundedRectangle}>
                    <Text style={styles.numberText}>{queue}</Text>
                </View>
                <Link
                    href={{
                        pathname: "/mentalQueueConfirmation",
                        params: {
                            name: param.name,
                            shorterQ: shorterQ
                        }
                    }} asChild
                >
                    <Button mode='contained' style={{ marginTop: 25 }} labelStyle={{ fontSize: 18 }} onPress={handleJoinQueue}>
                        Join Queue
                    </Button>
                </Link>
                {loading && <ActivityIndicator />}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        alignItems: 'center'
    },
    backContainer: {
        alignSelf: 'flex-start',
        marginTop: 10
    },
    headerText: {
        marginTop: 20,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        marginBottom: 20,
        marginTop: 70,
        textAlign: 'center'
    },
    roundedRectangle: {
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
        fontSize: 50,
        color: '#8000FF',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
    },
    confirmationContainer: {
        marginTop: 50,
        width: 320,
        height: 150,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmationText: {
        fontSize: 18,
        color: '#8000FF',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
    }
})