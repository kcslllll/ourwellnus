import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useAuth } from "../../contexts/auth";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { cancelScheduledNotificationAsync } from 'expo-notifications';

const MedicationTracker = () => {
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [medications, setMedications] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const notifications = useRef([]);

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
  }, [isDeleted, isFocused])

  const deleteMedication = async (medicationId) => {
    // delete medication from database returning
    // all notifications scheduled from that medication
    const { data } = await supabase.rpc('get_notifications', {medication_id: medicationId})
    if (data) {
      notifications.current = data;
      //console.log(notifications.current);
    }
    setIsDeleted(true);
    // cancel all scheduled notifications
    while(notifications.current.length > 0) {
      let identifier = notifications.current.pop();
      cancelScheduledNotificationAsync(identifier);
      console.log('notification cancelled: ' + identifier);
    }
    console.log(notifications.current);
    return;
  };

  const renderItem = ({ item }, index) => {
    return (
      <View style={styles.medicationContainer} key={index}>
        <Text style={styles.medicationText}>{item.medication_name}</Text>
        <Text style={styles.medicationText}>Time for first take: {item.reminder_time}</Text>
        <Text style={styles.medicationText}>
          Frequency: {
            item.frequency === 'once' ? 'Once a Day'
              : item.frequency === 'twice'
                ? 'Twice a Day'
                : 'Thrice a Day'
          }
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedication(item.medication_id)}>
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
          keyExtractor={(item, index) => {
            return  index.toString();
          }}
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