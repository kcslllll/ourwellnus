import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SPUCollection() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to the current date
  const [selectedTime, setSelectedTime] = useState(null);
  const router = useRouter();

  const handleConfirmationPage = () => {
    router.push("/confirmation");
  };

  const handleDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setSelectedDate(currentDate);
  };

  const handleTimeChange = (value) => {
    setSelectedTime(value);
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <TouchableOpacity style={styles.backContainer} onPressIn={() => router.back()}>
        <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Medication Collection</Text>
      <View style={styles.modeContainer}>
        <Text style={styles.modeText}>Mode of collection: Self Pick-Up</Text>
      </View>
      <Text style={styles.timePickerLabel}>Select date of collection:</Text>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
      <View style={styles.timePickerContainer}>
        <Text style={styles.timePickerLabel}>Select a time:</Text>
        <RNPickerSelect
          onValueChange={handleTimeChange}
          items={[
            { label: "8:30 AM", value: "8:30 AM" },
            { label: "9:00 AM", value: "9:00 AM" },
            { label: "9:30 AM", value: "9:30 AM" },
            { label: "10:00 AM", value: "10:00 AM" },
            { label: "10:30 AM", value: "10:30 AM" },
            { label: "11:00 AM", value: "11:00 AM" },
            { label: "11:30 AM", value: "11:30 AM" },
            { label: "1:30 PM", value: "1:30 PM" },
            { label: "2:00 PM", value: "2:00 PM" },
            { label: "2:30 PM", value: "2:30 PM" },
            { label: "3:00 PM", value: "3:00 PM" },
            { label: "3:30 PM", value: "3:30 PM" },
            { label: "4:00 PM", value: "4:00 PM" },
            { label: "4:30 PM", value: "4:30 PM" }
          ]}
          placeholder={{ label: "Select a time", value: null }}
          style={pickerSelectStyles}
          value={selectedTime}
        />
      </View>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={handleConfirmationPage}
      >
        Next
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#e9d3ff",
    alignItems: "center",
  },
  backContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 10
  },
  headerText: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "Trebuchet MS",
    textAlign: "center",
  },
  modeContainer: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 30,
  },
  modeText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  timePickerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  timePickerLabel: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
  },
  button: {
    marginTop: 40,
    backgroundColor: "blue",
    justifyContent: "center",
    height: 60,
    width: 160,
    marginTop: 70,
  },
  buttonLabel: {
    fontSize: 21,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    width: 200,
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    width: 200,
  },
});
