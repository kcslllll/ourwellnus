import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { Header } from 'react-native-elements';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';

export default function SummaryPage() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  const [timeSlot, setTimeSlot] = useState('You have not booked any slots.');
  const [medications, setMedications] = useState([]);

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
  },[isFocused])

  const renderMedication = ({ item }) => {
    return (
      <View key={item.medication_id} style={styles.itemContainer}>
        <Text style={styles.itemText}>
          Take {item.medication_name} at {item.reminder_time} 
          {
            item.frequency === 'once' ? ' once a day!'
              : item.frequency === 'twice'
                ? ' twice a day!'
                : ' thrice a day!'
          }
        </Text>
      </View>
    )
  }

  useEffect(() => {
    async function fetchTimeSlot() {
      const { data, error } = await supabase.from('self_pick_up_collection')
        .select('date_chosen, time_chosen')
        .eq('user_id', user.id);

      if (error) {
        console.log(error.message);
        setTimeSlot('You have not booked any slots.');
        return;
      }

      //console.log(data);
      setTimeSlot(data);
      return;
    }
    fetchTimeSlot();
  },[isFocused])

  const renderTimeSlot = ({ item }, index) => {
    return (
      <View key={index} style={styles.itemContainer}>
        <Text style={styles.itemText}>
          Booked: {item.date_chosen} at {item.time_chosen}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        <Text style={styles.summaryText}>Summary</Text>

        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="check-circle-outline" size={20} color="green" style={styles.icon} />
          <Text style={styles.trackerHeader}>Medication Tracker</Text>
        </View>

        <FlatList 
          style={styles.listContainer}
          data={medications}
          renderItem={renderMedication}
          keyExtractor={(item, index) => {
            return  index.toString();
          }}
        />

        <View style={styles.separator} />

        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#FC6C85" style={styles.icon} />
          <Text style={styles.collectionHeader}>Medication Collection</Text>
        </View>

        <FlatList 
          style={styles.listContainer}
          data={timeSlot}
          renderItem={renderTimeSlot}
          keyExtractor={(item, index) => {
            return  index.toString();
          }}
        />

        <View style={styles.separator} />

        <Button
          onPress={() => supabase.auth.signOut()}
          labelStyle={styles.buttonLabel}
          style={styles.logoutButton}
          mode="contained"
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#e9d3ff',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    position: 'relative',
    justifyContent: 'space-between'
  },
  summaryText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Trebuchet MS',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    height: Header.HEIGHT,
    paddingRight: 10,
    backgroundColor: 'transparent',
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 5,
  },
  trackerHeader: {
    color: 'green',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    marginLeft: 5,
  },
  collectionHeader: {
    color: '#FC6C85',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    marginLeft: 5,
  },
  listContainer: {
    borderRadius: 5,
    width: '100%',
    maxHeight: 200
  },
  normalText: {
    fontSize: 16,
  },
  separator: {
    height: 5,
  },
  icon: {
    marginRight: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  }
});
