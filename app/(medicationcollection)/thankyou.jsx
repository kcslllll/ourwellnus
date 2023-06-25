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
            Thank you for your {'\n'}
            confirmation, and {'\n'}
            we hope to see {'\n'}
            you soon!
          </Text>
          <Text style={styles.additionalText}>Please come within your stipulated {'\n'}
          timing, thank you!</Text>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => router.push('/summary')}
          >
            Back to home
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
    fontSize: 25,
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
    backgroundColor: "green",
    justifyContent: "center",
    height: 60,
    width: 160,
  },
  buttonLabel: {
    fontSize: 17,
  },
});