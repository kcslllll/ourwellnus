import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const BookingPage = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  const handleNextPage = () => {
    // Navigate to the next page
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        <View style={styles.bookingContainer}>
          <Text style={styles.bookingText}>Booking</Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.consultationTitle}>Consultation</Text>
        </View>

        <TouchableOpacity style={styles.section} onPress={() => router.push('/physicalQueue')}>
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Physical Health</Text>
            <View style={styles.arrowBackground}>
              <Ionicons name="arrow-forward" size={24} color="black" />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => router.push('/queueForm')}>
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Mental Health</Text>
            <View style={styles.arrowBackground}>
              <Ionicons name="arrow-forward" size={24} color="black" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.collectionTitle}>Collection</Text>
        </View>

        <TouchableOpacity style={styles.section} onPress={handleNextPage}>
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Medication Collection</Text>
            <View style={styles.arrowBackground}>
              <Ionicons name="arrow-forward" size={24} color="black" />
            </View>
          </View>
        </TouchableOpacity>
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
  bookingContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  bookingText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Trebuchet MS',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  section: {
    width: '80%',
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  consultationTitle: {
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    color: 'blue',
    fontSize: 20,
    marginBottom: 10,
  },
  collectionTitle: {
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    color: 'blue',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  subSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subSectionTitle: {
    flex: 1,
    fontSize: 16,
  },
  arrowBackground: {
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 5
  },
});

export default BookingPage;
