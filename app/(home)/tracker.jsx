import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, TextInput } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MedicationTracker = () => {
  const [medications, setMedications] = useState([]);
  const [medicationName, setMedicationName] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [frequency, setFrequency] = useState('once');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Notification permissions denied. You may not receive medication reminders.');
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const hideTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const handleTimeChange = (event, selected) => {
    if (selected) {
      setSelectedTime(selected);
    }
  };

  const addMedication = () => {
    const newMedication = {
      id: Date.now().toString(),
      name: medicationName,
      time: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      frequency: frequency,
    };

    setMedications([...medications, newMedication]);
    setMedicationName('');
    setSelectedTime(new Date());
    setFrequency('once');

    // Schedule local notifications for the medication times
    scheduleMedicationNotifications(newMedication);
  };

  const deleteMedication = id => {
    const updatedMedications = medications.filter(medication => medication.id !== id);
    setMedications(updatedMedications);
  };

  const scheduleMedicationNotifications = medication => {
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

  const scheduleNotification = (medication, time) => {
    const notificationTime = new Date(time);
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medication Reminder',
        body: `It's time to take your medication: ${medication.name}`,
      },
      trigger: {
        date: notificationTime,
        repeats: medication.frequency !== 'once',
      },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.medicationContainer}>
      <Text style={styles.medicationText}>{item.name}</Text>
      <Text style={styles.medicationText}>Time: {item.time}</Text>
      <Text style={styles.medicationText}>Frequency: {item.frequency}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedication(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        <View style={styles.trackerContainer}>
          <Text style={styles.trackerText}>Medication Tracker</Text>
          <View style={styles.inputContainer}>
            <Text>Medication Name:</Text>
            <TextInput
              style={styles.input}
              value={medicationName}
              onChangeText={setMedicationName}
            />
            <Text>Time:</Text>
            <TouchableOpacity style={styles.timePickerButton} onPress={showTimePickerModal}>
              <Text style={styles.timePickerButtonText}>{selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            <Text>Frequency:</Text>
            <TouchableOpacity
              style={styles.frequencyButton}
              onPress={() => setFrequency(prevFrequency => {
                if (prevFrequency === 'once') return 'twice';
                if (prevFrequency === 'twice') return 'thrice';
                return 'once';
              })}
            >
              <Text style={styles.frequencyButtonText}>
                {frequency === 'once' ? 'Once a Day' : frequency === 'twice' ? 'Twice a Day' : 'Thrice a Day'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={addMedication}>
              <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          <FlatList
            data={medications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.medicationList}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#e9d3ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  trackerContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  trackerText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Trebuchet MS',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerButtonText: {
    fontSize: 16,
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyButtonText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicationList: {
    marginTop: 20,
    width: '100%',
  },
  medicationContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medicationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MedicationTracker;
