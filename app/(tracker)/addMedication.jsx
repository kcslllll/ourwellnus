import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, TouchableOpacity, Pressable, View, Alert } from 'react-native';
import { useRef, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

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

export default function AddMedication() {
    const router = useRouter();
    const { user } = useAuth();

    const [medicationName, setMedicationName] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [frequency, setFrequency] = useState('once');
    const [hour, setHour] = useState(null);
    const [minute, setMinute] = useState(null);
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();

    // when time has been selected in the time picker
    const handleTimeChange = (event, selected) => {
        if (event.type === 'set' && selected) {
            setSelectedTime(selected);
            setHour(Number(selectedTime.toLocaleTimeString("en-US", { hour12: false }).slice(0, 2)));
            setMinute(Number(selectedTime.toLocaleTimeString("en-US", { hour12: false }).slice(3, 5)));
        }
    };

    useEffect(() => {
        // Register device for push notifications
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        console.log(expoPushToken);

        // Listens for notifications in the foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });
    }, []);

    // schedules push notifications
    async function schedulePushNotification(hour, minute) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Time to take your medication!",
                sound: 'default'
            },
            trigger: {
                hour: hour,
                minute: minute,
                repeats: true
            },
        });
        console.log('notification scheduled');
    }

    const scheduleMedicationNotifications = async () => {
        if (frequency == 'once') {
            schedulePushNotification(hour, minute);
            return;
        } else if (frequency == 'twice') {
            schedulePushNotification(hour, minute);
            schedulePushNotification((hour + 12), minute);
            return;
        } else if (frequency == 'thrice') {
            schedulePushNotification(hour, minute);
            schedulePushNotification((hour + 8), minute);
            schedulePushNotification((hour + 16), minute);
            return;
        }
        return;
    };

    const handleAddMedication = async () => {
        // insert input variables into database
        // schedule push notifications
        const { error } = await supabase
            .from('medication_tracker')
            .insert({
                user_id: user.id,
                medication_name: medicationName,
                reminder_time: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                frequency: frequency
            });

        if (error) {
            console.log(error.message);
            return;
        }

        scheduleMedicationNotifications();
        router.replace('/tracker');
        return;
    };

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Pressable style={styles.backContainer} onPressIn={() => router.back()}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </Pressable>
            <Text style={styles.headerText}>Add Medication</Text>

            <Text style={styles.firstText}>Medication Name (include Dosage):</Text>
            <TextInput
                style={styles.inputContainer}
                value={medicationName}
                onChangeText={setMedicationName} />

            <Text style={styles.secondText}>Time for reminder:</Text>
            <TouchableOpacity style={styles.componentButton} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.componentText}>
                    {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </TouchableOpacity>

            {showTimePicker && (
                <View style={styles.timePickerContainer}>
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        onChange={handleTimeChange}
                    />
                    <Button onPress={() => setShowTimePicker(false)} style={styles.confirmButton} mode='outlined'>
                        Confirm
                    </Button>
                </View>
            )}

            <Text style={styles.secondText}>Frequency:</Text>
            <TouchableOpacity
                style={styles.componentButton}
                onPress={() =>
                    setFrequency((prevFrequency) => {
                        if (prevFrequency === 'once') return 'twice';
                        if (prevFrequency === 'twice') return 'thrice';
                        return 'once';
                    })
                }
            >
                <Text style={styles.componentText}>
                    {frequency === 'once' ? 'Once a Day (24 hour interval)' : frequency === 'twice' ? 'Twice a Day (12 hour interval)' : 'Thrice a Day (8 hour interval)'}
                </Text>
            </TouchableOpacity>

            <Button
                mode='contained'
                style={styles.addMedButton}
                labelStyle={{ fontSize: 18 }}
                onPress={handleAddMedication}
            >
                Add Medication
            </Button>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        paddingHorizontal: 10
    },
    backContainer: {
        paddingHorizontal: 10,
        marginTop: 10
    },
    headerText: {
        marginTop: 20,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    firstText: {
        fontSize: 16,
        marginTop: 30
    },
    secondText: {
        fontSize: 16,
        marginTop: 10
    },
    inputContainer: {
        marginTop: 20,
        height: 50,
        backgroundColor: 'white'
    },
    componentButton: {
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    componentText: {
        fontSize: 16,
    },
    addMedButton: {
        marginTop: 40,
        alignSelf: 'center',
        width: 200
    },
    timePickerContainer: {
        backgroundColor: 'white',
        borderRadius: 10
    },
    confirmButton: {
        marginBottom: 10,
        alignSelf: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});