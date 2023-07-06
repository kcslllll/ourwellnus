import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/auth";

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "It is your turn!",
            body: 'Your doctor is waiting for you, please return to Our WellNUS app now.',
            sound: 'default'
        },
        trigger: {
            seconds: 2
        },
    });
}

async function registerForPushNotificationsAsync() {
    let token;

    /* For android devices
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }*/

    if (Device.isDevice) {
        // check current notification permission status
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            // permission for notifications not granted, request for permission
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            // final permission still not granted
            Alert.alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
}

export default function MentalQueueConfirmation() {
    // Sending push notifications when user turn
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        // Register device for push notifications
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        //console.log(expoPushToken);

        // Listens for notifications in the foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // Redirects user to the Waiting Room
            router.replace('/mentalWaitingRoom');
            //console.log(notification);

        });

        // Listens for interactions with notifications in fore/background
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // When user taps on the notification, direct user to Waiting Room
            router.replace('/mentalWaitingRoom');
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [expoPushToken, router]);

    const router = useRouter();
    const [position, setPosition] = useState(null);
    const [joinTime, setJoinTime] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const param = useLocalSearchParams();

    const onRefresh = useEffect(() => {
        setInterval(() => {
            setRefreshing(true);
            setTimeout(() => {
                setRefreshing(false);
            }, 500);
        }, 30000)
    });

    useEffect(() => {
        // fetch join time of user in the queue database
        async function fetchJoinTime() {
            const { data } = await supabase
                .from('mental_queue')
                .select('joined_at')
                .eq('user_id', user.id);
            if (data.length > 0) {
                //console.log(data);
                setJoinTime(data[0].joined_at);
            }
        }
        fetchJoinTime();
    }, [user.id, router])

    useEffect(() => {
        // get position of user in the queue
        async function fetchPosition() {
            if (param.name !== 'No Preference') {
                const { data } = await supabase
                    .from('mental_queue')
                    .select('joined_at')
                    .eq('doctor_chosen', param.name)
                    .lt('joined_at', joinTime);
                if (data !== null) {
                    console.log(data)
                    setPosition(data.length + 1);
                }
            } else {
                const { data } = await supabase
                    .from('mental_queue')
                    .select('joined_at')
                    .eq('doctor_chosen', param.shorterQ)
                    .lt('joined_at', joinTime);
                if (data !== null) {
                    console.log(data);
                    setPosition(data.length + 1);
                }
            }
        }
        fetchPosition();
    }, [refreshing, joinTime, param.name, param.shorterQ])

    useEffect(() => {
        // when user is the first in queue
        async function DeleteUser() {
            const { error } = await supabase.from('mental_queue').delete().eq('user_id', user.id)
            if (error) {
                console.log(error.message);
            }
            return;
        }

        if (position === 1) {
            schedulePushNotification();
            DeleteUser();
        }
    }, [position, user.id])

    const handleLeaveQueue = async () => {
        // when user chooses to leave queue halfway
        async function LeaveQueue() {
            const { error } = await supabase
                .from('mental_queue')
                .delete()
                .eq('user_id', user.id)
            if (error) {
                console.log(error.message);
                return;
            } else {
                router.replace("/queueForm");
                return;
            }
        }

        Alert.alert(
            'Are you sure?',
            'You will lose your position in the queue.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Alert Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Leave Queue',
                    onPress: () => LeaveQueue(),
                },
            ]
        );
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
                <Text style={styles.headerText}>Mental Health Consultation</Text>
                <Text style={styles.subHeaderText}>Thank you for waiting! Your current position in the queue is:</Text>
                <View style={styles.roundedRectangle}>
                    <Text style={styles.numberText}>{position}</Text>
                </View>
                <Text style={styles.normalText}>
                    Please do not leave this screen, {'\n'}
                    we will notify you when it is your turn!
                </Text>
                <Button mode='contained' style={{ marginTop: 30 }} labelStyle={{ fontSize: 18 }} onPress={handleLeaveQueue}>Leave Queue</Button>
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
    headerText: {
        marginTop: 40,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        marginBottom: 30,
        marginTop: 110,
        textAlign: 'center',
        padding: 10
    },
    normalText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        marginTop: 30,
        textAlign: 'center',
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