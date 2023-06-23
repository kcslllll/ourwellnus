import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import { useState } from "react";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function WaitingRoom() {
    const router = useRouter();
    const [callUrl, setcallUrl] = useState('');

    const handleJoinCall = async () => {
        // Join call with URL
        // Deletes user from the queue database

        router.push('/physicalCall');
    }

    const handleLeaveRoom = async () => {
        // Ends call on doctor's side with a notification for doctor
        // Alert to double confirm on choice
        // Deletes user from the queue database
        Alert.alert(  
            'Are you sure?',  
            'You will lose your position in the queue.',  
            [  
                {  
                    text: 'Cancel',  
                    onPress: () => console.log('Alert Cancel Pressed'),  
                    style: 'cancel',  
                },  
                {   text: 'Leave Queue', 
                    onPress: () => router.push('/physicalQueue'),
                },  
            ]  
        );  

    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Waiting Room</Text>
            <Text style={styles.normalText}>
                The doctor is preparing for your consultation. An email with the call link will be sent to you shortly.
            </Text>
            <Text style={styles.normalText}>Call URL:</Text>
            <TextInput
                style={styles.input}
                value={callUrl}
                onChangeText={setcallUrl}
                placeholder="Paste your link here"
                multiline={true}
            />
            <Button mode='contained' style={styles.firstButton} onPress={handleJoinCall} labelStyle={{fontSize: 18}}>Join Call</Button>
            <Button mode='contained' style={styles.secondButton} onPress={handleLeaveRoom} labelStyle={{fontSize: 18}}>Leave Room</Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        paddingHorizontal: 20
    },
    headerText: {
        marginTop: 40,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    normalText: {
        marginTop: 50,
        fontSize: 16,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
    },
    input: {
        marginTop: 10,
        height: 150,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#FFFFFF",
    },
    firstButton: {
        marginTop: 95,
        alignSelf: 'center',
        width: 200
    },
    secondButton: {
        width: 200,
        marginTop: 15,
        alignSelf: 'center',
    },
})