import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SummaryPage = () => {
  const [historyLog, setHistoryLog] = useState('');
  const [status, setStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    // Handle refresh logic here
    setIsRefreshing(true);

    // Simulating a delay to showcase the refresh functionality
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-circle-outline" size={30} color="black" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>History Log:</Text>
      </View>
      <View style={styles.logContainer}>
        <Text style={styles.logText}>{historyLog}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Status for Medication Collection:</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    position: 'relative', // Ensure the parent container is relatively positioned
  },
  profileButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 999, // Ensure the circle is positioned above other content
  },
  headerContainer: {
    marginTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
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
    height: 100, // Add desired space between the sections
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 16,
  },
});

export default SummaryPage;