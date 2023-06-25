import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";

export default function PhysicalQueueConfirmation() {
    const router = useRouter();
    const [position, setPosition] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // get position of user in the queue database
        async function fetchPosition() {
            setPosition(1);
        }
        fetchPosition();
    })

    useEffect(() => {
        async function DeleteUser() {
            const { error } = await supabase.from('physical_queue').delete().eq('user_id', user.id)
            if (error) {
                console.log(error.message);
            }
            return;
        }

        if (position === 1) {
            DeleteUser();
            router.push('/waitingRoom');
        }
    })

    const handleLeaveQueue = async () => {
        // Remove user from queue table in database

        async function LeaveQueue() {
            const { error } = await supabase
                .from('physical_queue')
                .delete()
                .eq('user_id', user.id)
            if (error) {
                console.log(error.message);
                return;
            } else {
                router.push("/physicalQueue");
                return;
            }
        }

        Alert.alert(
            'Are you sure?',
            'You will lose your position in the queue.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Alert Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Leave Queue',
                    onPress: () => LeaveQueue(),
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Physical Health Consultation</Text>
            <Text style={styles.subHeaderText}>Thank you for waiting! Your current position in the queue is:</Text>
            <View style={styles.roundedRectangle}>
                <Text style={styles.numberText}>{position}</Text>
            </View>
            <Text style={styles.normalText}>We will notify you when it is your turn!</Text>
            <Button mode='contained' style={{ marginTop: 30 }} labelStyle={{ fontSize: 18 }} onPress={handleLeaveQueue}>Leave Queue</Button>
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