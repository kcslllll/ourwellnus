import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function PhysicalEndChat() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Your consultation has ended!</Text>
            <Text style={styles.normalText}>
                Thank you for using Our WellNUS. Before you go, do remember to book a specific time slot for you to collect your medication, if necessary.
            </Text>
            <Button
                mode="contained"
                labelStyle={{fontSize: 18}}
                style={styles.firstButton}
                onPress={() => router.push('/medicationcollection')}
            >
                Book a Time Slot
            </Button>
            <Button  
                mode="contained" 
                labelStyle={{fontSize: 18}}
                style={styles.secondButton}
                onPress={() => router.replace('/summary')}
            >
                Back to Home
            </Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    headerText: {
        marginTop: 230,
        fontSize: 36,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    normalText: {
        marginTop: 20,
        fontSize: 17,
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    firstButton: {
        width: 250,
        marginTop: 50,
    },
    secondButton: {
        width: 250,
        marginTop: 20,
    }
})