import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ProfilePage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backContainer} onPressIn={() => router.back()}>
        <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
      </TouchableOpacity>
      <Text style={styles.text}></Text>
      <Button
        onPress={() => supabase.auth.signOut()}
        labelStyle={styles.buttonLabel}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonLabel: {
    fontSize: 20,
    color: '#ffffff', // Text color for the button
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: 'grey', // Background color for the button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default ProfilePage;
