import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function MentalQueue() {
    const router = useRouter();
    // To get the count of people in queue
    const numberOfPeopleInQueue = async () => {
        const { data } = await supabase.functions()
        return { data };
    }
    
    const handleJoinQueue = () => {
        // Add user to queue table in database
        router.push('/mentalQueueConfirmation');
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Pressable style={styles.backContainer} onPressIn={() => router.back()}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </Pressable>
            <Text style={styles.headerText}>Mental Health Consultation</Text>
            <View style={styles.confirmationContainer}>
                <Text style={styles.confirmationText}>Confirmation:</Text>
                <Text style={{marginTop: 10, fontSize: 16}}>Doctor: Dr Susan Lim</Text>
                <Text style={{marginTop: 5, fontSize: 16}}>Consultation on: Family, Relationship</Text>
            </View>
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
    backContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        marginTop: 10
    },
    headerText: {
        marginTop: 20,
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
        marginTop: 70,
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
    confirmationContainer: {
        marginTop: 50,
        width: 320,
        height: 150,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems:'center'
    },
    confirmationText: {
        fontSize: 18,
        color: '#8000FF',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
    }
})