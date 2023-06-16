import { useState, useEffect } from 'react';
import { Button } from "react-native-paper";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from "/home/ruo-x/our-wellnus/lib/supabase.js";

const SummaryPage = () => {
  const navigation = useNavigation();

  const navigateToProfile = () => {
    navigation.navigate('profilepage');
  };

  navigation.setOptions({
    headerShown: false, // Hide the header
  });

  const [historyLog, setHistoryLog] = useState('');
  const [status, setStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSummaryPage = () => {
    const latestHistoryLog = '10 May 2023 8.47pm\n\nPhysical Health Consultation';
    const latestStatus = 'In progress';
    setHistoryLog(latestHistoryLog);
    setStatus(latestStatus);
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

        <TouchableOpacity style={styles.profileButton} onPress={navigateToProfile}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="orange" style={styles.timeIcon} />
          <Text style={styles.historyHeader}>History Log</Text>
        </View>

        <View style={styles.logContainer}>
          <Text style={styles.logText}>{historyLog}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="check-circle-outline" size={20} color="green" style={styles.tickIcon} />
        </View>
          <Text style={styles.statusHeader}>Status for Medication Collection</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, status === 'In progress' && styles.inProgressText]}>
            {status}
          </Text>
        </View>
        <Button onPress = {() => supabase.auth.signOut()}>Logout</Button>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    fontSize: 30,
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
  statusHeader: {
    color: 'green',
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

export default SummaryPage;
