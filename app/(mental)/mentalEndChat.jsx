import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function MentalEndChat() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Your consultation has ended!</Text>
            <Text style={styles.normalText}>
                Hope you had a fruitful experience! We are always here to lend a ear.
            </Text>
            <Button  
                mode="contained" 
                labelStyle={{fontSize: 18}}
                style={styles.homeButton}
                onPress={() => router.push('/summary')}
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
        marginTop: 260,
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
        paddingHorizontal: 20,
    },
    homeButton: {
        width: 250,
        marginTop: 40,
    }
})