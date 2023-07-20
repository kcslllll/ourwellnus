import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";

export default function PhysicalWaitingRoom() {
    const router = useRouter();
    const { user } = useAuth();

    const [isReady, setIsReady] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [roomId, setRoomId] = useState(null);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    useEffect(() => {
        async function fetchReady() {
            const { data } = await supabase.from('room_participants')
                .select('room_id')
                .eq('user_id', user.id)
            if (data.length === 0) {
                setIsReady(false);
            } else {
                //console.log(data);
                setRoomId(data[0].room_id)
                setIsReady(true);
            }
        }
        fetchReady();
    }, [user.id, refreshing])

    useEffect(() => {
        if (!isReady) {
            setStatusText('Any minute now! Your doctor is still preparing for your consultation, do refresh for updates.');
        } else {
            setStatusText('All set! You may proceed to join the chat room for your consultation by clicking on the "Join Chat" button.');
        }
    }, [isReady])

    const deleteUser = async () => {
        const { error } = await supabase.from('physical_queue').delete().eq('user_id', user.id)
        if (error) {
            console.log(error.message);
        }
        return;
    };

    const handleLeaveRoom = async () => {
        // Ends call on doctor's side with a notification for doctor
        // Alert to double confirm on choice
        Alert.alert(
            'Are you sure?',
            'You will have to queue again to come back to this page.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Alert Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Leave Room',
                    onPress: () => {
                        deleteUser();
                        router.push('/physicalQueue');
                    }
                },
            ]
        );
    };

    const handleJoinChat = async () => {
        // deletes user from the queue
        deleteUser();
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
                <Text style={styles.headerText}>Waiting Room</Text>
                <Text style={styles.normalText}>Your Current Status:</Text>
                <View style={styles.roundedRectangle}>
                    <Text style={isReady ? styles.ready : styles.inProgress}>{statusText}</Text>
                </View>
                <Link
                    href={{
                        pathname: '/physicalChat',
                        params: {
                            roomId: roomId
                        }
                    }} asChild
                >
                    <Button
                        mode='contained'
                        style={styles.firstButton}
                        onPress={handleJoinChat}
                        labelStyle={{ fontSize: 18 }}
                        disabled={isReady ? false : true}

                    >
                        Join Chat
                    </Button>
                </Link>
                <Button
                    mode='contained'
                    style={styles.secondButton}
                    onPress={handleLeaveRoom}
                    labelStyle={{ fontSize: 18 }}
                >
                    Leave Room
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        paddingHorizontal: 10
    },
    headerText: {
        marginTop: 70,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    normalText: {
        marginTop: 70,
        fontSize: 16,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
    },
    roundedRectangle: {
        marginTop: 10,
        height: 200,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        justifyContent: 'center'
    },
    firstButton: {
        marginTop: 115,
        alignSelf: 'center',
        width: 200
    },
    secondButton: {
        width: 200,
        marginTop: 20,
        alignSelf: 'center',
    },
    inProgress: {
        // red
        fontSize: 18,
        color: 'red',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
        paddingHorizontal: 10,
    },
    ready: {
        // green 
        fontSize: 18,
        color: '#1DBA36',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
        paddingHorizontal: 10,
    }
})