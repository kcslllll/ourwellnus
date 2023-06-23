import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function PhysicalQueueConfirmation() {
    const router = useRouter();
    
    // To get the count of people in queue + 1
    const numberOfPeopleInQueue = async () => {
        const { data } = await supabase.functions()
        return { data };
    }
    
    const queueNumber = '1';

    useEffect(() => {
        if (queueNumber === '1') {
            router.push('/waitingRoom');
        }
    },[queueNumber, router])

    const handleLeaveQueue = () => {
        // Remove user from queue table in database

        router.push('/physicalQueue');
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Physical Health Consultation</Text>
            <Text style={styles.subHeaderText}>Thank you for waiting! Your current position in the queue is:</Text>
            <View style={styles.roundedRectangle}>
                <Text style={styles.numberText}>{queueNumber}</Text>
            </View>
            <Text style={styles.normalText}>We will notify you when it is your turn!</Text>
            <Button mode='contained' style={{marginTop: 30}} labelStyle={{fontSize: 18}} onPress={handleLeaveQueue}>Leave Queue</Button>
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
        marginBottom: 30, 
        marginTop: 90, 
        textAlign: 'center',
        padding: 10
    },
    normalText: {
        fontSize: 18, 
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        marginTop: 30, 
        textAlign: 'center',
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