import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/auth";
import { Ionicons } from "@expo/vector-icons";

export default function PhysicalQueue() {
    const router = useRouter();
    const [queue, setQueue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { user } = useAuth();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    useEffect(() => {
        async function fetchQueue() {
            const { count } = await supabase
                .from('physical_queue')
                .select('id', { count: 'exact' });
            setQueue(count);
        }
        fetchQueue();
    },[refreshing]);

    const handleJoinQueue = async () => {
        // Add user to queue table in database
        setLoading(true);
        const { error } = await supabase.from('physical_queue').insert({ user_id: user.id });
        setLoading(false);
        if (error) {
            console.log(error.message);
            return;
        }
        router.push('/physicalQueueConfirmation');
        return;
    };

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
                <Text style={styles.headerText}>Physical Health Consultation</Text>
                <Text style={styles.subHeaderText}>Number of people in queue:</Text>
                <View style={styles.roundedRectangle}>
                    <Text style={styles.numberText}>{queue}</Text>
                </View>
                <Button mode='contained' style={{ marginTop: 25 }} labelStyle={{ fontSize: 18 }} onPress={handleJoinQueue}>
                    Join Queue
                </Button>
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
        marginTop: 130,
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
})