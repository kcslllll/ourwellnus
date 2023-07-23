import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button } from 'react-native-paper';
import { Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';

export default function SummaryPage() {
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  const [historyLog, setHistoryLog] = useState('');
  const [status, setStatus] = useState('');
  const [timeSlot, setTimeSlot] = useState('You have not booked any slots.');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        if (data[0].time_chosen < Date.now()) {
          setTimeSlot('You have missed: ' + data[0].date_chosen + ' ' + data[0].time_chosen + '. Please book another slot.')
        } else {
          setTimeSlot('You have booked: ' + data[0].date_chosen + ' ' + data[0].time_chosen);
        }
        return;
    }
    fetchTimeSlot();
  },[])

  const refreshSummaryPage = () => {
    const latestHistoryLog = '';
    setHistoryLog(latestHistoryLog);
  };

  useEffect(() => {
    refreshSummaryPage();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);

    // Simulating a delay to showcase the refresh functionality
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Summary</Text>
        </View>
        <View style={styles.headerContainer}>
        <MaterialCommunityIcons name="check-circle-outline" size={20} color="green" style={styles.tickIcon} />
          <Text style={styles.trackerHeader}>Medication Tracker</Text>
        </View>

        <View style={styles.logContainer}>
          <Text style={styles.logText}>{historyLog}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#FC6C85" style={styles.tickIcon} />
          </View>
          <Text style={styles.collectionHeader}>Medication Collection</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {timeSlot}
          </Text>
        </View>

        <View style={styles.separator} />

        <Button
        onPress={() => supabase.auth.signOut()}
        labelStyle={styles.buttonLabel}
        style={styles.logoutButton}
        mode = "contained"
        >
        Logout
      </Button>
      </ScrollView>
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
    justifyContent:'space-between'
  },
  profileButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 999,
  },
  summaryContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Trebuchet MS',
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
  historyHeader: {
    color: 'orange',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    marginLeft: 5,
  },
  logoutButton: {
    marginTop: 100,
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
  logContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  logText: {
    fontSize: 16,
  },
  separator: {
    height: 80,
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 16,
  },
  tickIcon: {
    marginRight: 1,
  },
  inProgressText: {
    color: 'black',
  },
  timeIcon: {
    marginRight: 1,
  },
});
