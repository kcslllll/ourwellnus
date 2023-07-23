import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { Button } from 'react-native-paper';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MedicationTracker = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [medications, setMedications] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    async function fetchMedications() {
      const { data } = await supabase
        .from('medication_tracker')
        .select('*')
        .eq('user_id', user.id);
      if (!data) {
        console.log('no medication added')
        return;
      }
      //console.log(medications);
      setMedications(data);
    }
    fetchMedications();

    return () => setIsDeleted(false);
  }, [isDeleted])

  const deleteMedication = async (medicationId) => {
    // delete medication from database
    const {error} = await supabase.from('medication_tracker').delete().eq('id', medicationId);
    if (error) {
      console.log(error.message);
      return;
    }
    setIsDeleted(true);
    // cancel all scheduled notifications
    return;
  };

  const renderItem = ({ item }) => {
    
    return (
      <View style={styles.medicationContainer}>
        <Text style={styles.medicationText}>{item.medication_name}</Text>
        <Text style={styles.medicationText}>Time: {item.reminder_time}</Text>
        <Text style={styles.medicationText}>
          Frequency: {
            item.frequency === 'once' ? 'Once a Day'
              : item.frequency === 'twice'
                ? 'Twice a Day'
                : 'Thrice a Day'
          }
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedication(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Medication Tracker</Text>
        <Button onPress={() => router.push('/addMedication')} mode='contained'>+ Add medication</Button>
        <FlatList
          data={medications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.medicationList}
        />
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
  headerText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Trebuchet MS',
    textAlign: 'center',
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  medicationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    alignSelf:'flex-end',
    backgroundColor: 'red',
    width: 80,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timePickerContainer: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicationTracker;

