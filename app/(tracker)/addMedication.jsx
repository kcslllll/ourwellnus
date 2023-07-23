import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, TouchableOpacity, Pressable, View } from 'react-native';
import { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from "../../lib/supabase";
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

export default function AddMedication() {
    const router = useRouter();
    const {user} = useAuth();

    const [medicationName, setMedicationName] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [frequency, setFrequency] = useState('once');

    // schedules push notifications
    async function schedulePushNotification() {
        const trigger = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    
      const scheduleMedicationNotifications = (medication) => {
        if (medication.frequency === 'once') {
          scheduleNotification(medication, medication.time);
        } else if (medication.frequency === 'twice') {
          const firstTime = new Date(medication.time);
          const secondTime = new Date(firstTime.getTime() + 12 * 60 * 60 * 1000);
          scheduleNotification(medication, firstTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          scheduleNotification(medication, secondTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else if (medication.frequency === 'thrice') {
          const firstTime = new Date(medication.time);
          const secondTime = new Date(firstTime.getTime() + 8 * 60 * 60 * 1000);
          const thirdTime = new Date(firstTime.getTime() + 16 * 60 * 60 * 1000);
          scheduleNotification(medication, firstTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          scheduleNotification(medication, secondTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          scheduleNotification(medication, thirdTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      };
    
      const scheduleNotification = async (medication, time) => {
        const identifier = medication.id;
        const notificationTime = new Date(time);
        const schedulingOptions = {
          content: {
            title: 'Medication Reminder',
            body: `It's time to take your medication!`,
            data: { medicationId: medication.id },
          },
          trigger: { date: notificationTime },
        };
    
        await Notifications.scheduleNotificationAsync(schedulingOptions);
      };
    

    // when time has been selected in the time picker
    const handleTimeChange = (event, selected) => {
        if (event.type === 'set' && selected) {
            setSelectedTime(selected);
        }
    };

    const handleAddMedication = async () => {
        // insert input variables into database
        // schedule push notifications
        const {error} = await supabase
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