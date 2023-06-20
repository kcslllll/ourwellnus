import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function PhysicalQueue() {
    const router = useRouter();
    // To get the count of people in queue
    const numberOfPeopleInQueue = async () => {
        const { data } = await supabase.functions()
        return { data };
    }
    
    const handleJoinQueue = () => {
        // Add user to queue table in database

        router.push('/physicalQueueConfirmation');
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Physical Health Consultation</Text>
            <Text style={styles.subHeaderText}>Number of people in queue:</Text>
            <View style={styles.roundedRectangle}>
                <Text style={styles.numberText}>6</Text>
            </View>
            <Button mode='contained' style={{ marginTop: 25 }} labelStyle={{ fontSize: 18 }} onPress={handleJoinQueue}>
                Join Queue
            </Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        alignItems: 'center'
    },
    headerText: {
        marginTop: 40,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        marginBottom: 20,
        marginTop: 140,
        textAlign: 'center'
    },
    roundedRectangle: {
        width: 130,
        height: 110,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center'
    },
    numberText: {
        fontSize: 50,
        color: '#8000FF',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
    },
})