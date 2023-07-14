import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TrackerPage = () => {
  const navigation = useNavigation();
  const [medications, setMedications] = useState([]);
  const [medicationName, setMedicationName] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [dosageUnit, setDosageUnit] = useState('tablets');
  const [dosageAmount, setDosageAmount] = useState('');
  const [medicationRepetition, setMedicationRepetition] = useState('');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  const addMedication = () => {
    const time = selectedTime
      ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
      
    const newMedication = {
      id: Date.now().toString(),
      name: medicationName,
      dosage: `${dosageAmount} ${dosageUnit}`,
      repetition: medicationRepetition,
      time: time,
    };

    setMedications([...medications, newMedication]);
    setMedicationName('');
    setMedicationDosage('');
    setDosageAmount('');
    setMedicationRepetition('');
    setSelectedTime(null);
  };

  const removeMedication = (id) => {
    setMedications(medications.filter((medication) => medication.id !== id));
  };

  const showTimePicker = () => {
    setIsTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setIsTimePickerVisible(false);
  };

  const handleConfirmTime = (selectedTime) => {
    setSelectedTime(selectedTime);
    setIsTimePickerVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.medicationContainer}>
      <Text style={styles.medicationText}>{item.name}</Text>
      <Text style={styles.medicationText}>Dosage: {item.dosage}</Text>
      <Text style={styles.medicationText}>Repetition: {item.repetition}</Text>
      <Text style={styles.medicationText}>Time: {item.time}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeMedication(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
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
            <Text>Dosage:</Text>
            <View style={styles.dosageContainer}>
              <TextInput
                style={styles.dosageInput}
                value={dosageAmount}
                onChangeText={setDosageAmount}
              />
              <TouchableOpacity
                style={[
                  styles.dosageUnitButton,
                  dosageUnit === 'tablets' && styles.activeDosageUnitButton,
                ]}
                onPress={() => setDosageUnit('tablets')}
              >
                <Text style={styles.dosageUnitButtonText}>Tablets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dosageUnitButton,
                  dosageUnit === 'ml' && styles.activeDosageUnitButton,
                ]}
                onPress={() => setDosageUnit('ml')}
              >
                <Text style={styles.dosageUnitButtonText}>mL</Text>
              </TouchableOpacity>
            </View>
            <Text>Repetition:</Text>
            <TextInput
              style={styles.input}
              value={medicationRepetition}
              onChangeText={setMedicationRepetition}
            />
            <Text>Time:</Text>
            <TouchableOpacity style={styles.input} onPress={showTimePicker}>
              <Text>{selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              is24Hour
              onConfirm={handleConfirmTime}
              onCancel={hideTimePicker}
            />
            <TouchableOpacity style={styles.addButton} onPress={addMedication}>
              <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
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
  dosageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dosageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  dosageUnitButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  activeDosageUnitButton: {
    backgroundColor: 'blue',
  },
  dosageUnitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  medicationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TrackerPage;
