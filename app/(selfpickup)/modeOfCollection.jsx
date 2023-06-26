import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ModeOfCollection() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
  };

  const handleNextPage = () => {
    if (selectedMode === "selfPickUp") {
      router.push("/selfPickUp");
    } else if (selectedMode === "delivery") {
      router.push("/delivery");
    }
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <TouchableOpacity style={styles.backContainer} onPressIn={() => router.back()}>
        <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Medication Collection</Text>
      <Text style={styles.subHeaderText}>Select mode of collection...</Text>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleSelectMode("selfPickUp")}
      >
        <View
          style={[
            styles.checkbox,
            selectedMode === "selfPickUp" && styles.checkedCheckbox,
          ]}
        />
        <Text style={styles.checkboxLabel}>Self Pick-Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleSelectMode("delivery")}
      >
        <View
          style={[
            styles.checkbox,
            selectedMode === "delivery" && styles.checkedCheckbox,
          ]}
        />
        <Text style={styles.checkboxLabel}>Delivery</Text>
      </TouchableOpacity>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={handleNextPage}
        disabled={!selectedMode}
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
  subHeaderText: {
    fontSize: 22,
    fontWeight: "300",
    fontFamily: "Georgia",
    marginLeft: 40,
    marginBottom: 20,
    marginTop: 80,
    alignSelf: "flex-start",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: 80,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#000",
  },
  checkboxLabel: {
    fontSize: 20,
    marginTop: 2,
  },
  button: {
    marginTop: 40,
    justifyContent: "center",
    height: 60,
    width: 160,
  },
  buttonLabel: {
    fontSize: 20,
    justifyContent: "center",
    marginTop: 13,
  },
});
