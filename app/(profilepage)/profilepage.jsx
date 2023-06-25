import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

const ProfilePage = () => {
  return (
    <View style={styles.container}>
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

