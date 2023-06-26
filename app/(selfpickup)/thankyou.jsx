import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function MedicationCollection() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.pageContainer}>
          <Text style={styles.subHeaderText}>
            Thank you for your confirmation, and
            we hope to see
            you soon!
          </Text>
          <Text style={styles.additionalText}>Please be reminded to come within the stipulated time.</Text>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => router.push('/summary')}
          >
            Back to Home
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
  subHeaderText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Trebuchet MS",
    marginBottom: 50,
    marginTop: 200,
    textAlign: "center",
  },
  additionalText: {
    fontSize: 18,
    fontFamily: "Trebuchet MS",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 40,
    justifyContent: "center",
    height: 60,
    width: 220,
  },
  buttonLabel: {
    fontSize: 18,
  },
});