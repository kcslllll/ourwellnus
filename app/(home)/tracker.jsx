import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const TrackerPage = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        <View style={styles.trackerContainer}>
          <Text style={styles.trackerText}>Tracker</Text>
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
});

export default TrackerPage;
