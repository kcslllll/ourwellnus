import { Text, View, StyleSheet, Alert, ScrollView, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function DoctorConsultation() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    const [queue, setQueue] = useState(null);

    // Shows number of people in the queue for physical health consultations
    useEffect(() => {
        async function fetchQueue() {
            const { count } = await supabase
                .from('physical_queue')
                .select('id', { count: 'exact' });
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
            router.push('/doctorStart');
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
                <Pressable style={styles.backContainer} onPressIn={() => router.back()}>
                    <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
                </Pressable>
                <Text style={styles.headerText}>Start a Consultation</Text>
                    <Text style={styles.normalText}>Number of people in queue:</Text>
                    <View style={styles.roundedRectangle}>
                        <Text style={styles.numberText}>{queue}</Text>
                    </View>
                    <Button
                        mode='contained'
                        style={styles.buttonContainer}
                        labelStyle={{ fontSize: 18 }}
                        onPress={handleStartConsult}
                    >
                        Start Consultation
                    </Button>
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
    headerText: {
        marginTop: 40,
        fontSize: 36,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    normalText: {
        fontSize: 18,
        alignSelf: 'center',
        fontFamily: 'Trebuchet MS',
        marginTop: 150
    },
    roundedRectangle: {
        marginTop: 50,
        width: 130,
        height: 110,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    numberText: {
        fontSize: 50,
        color: '#8000FF',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
    },
    buttonContainer: {
        marginTop: 50,
        width: 220,
        alignSelf: 'center'
    }
})