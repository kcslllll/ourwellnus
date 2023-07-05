import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, Text, TextInput, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { useState } from "react";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

// disabled={(callUrl === '') ? true : false}

export default function MentalWaitingRoom() {
    const router = useRouter();
    const [callUrl, setcallUrl] = useState('');

    const handleLeaveRoom = async () => {
        // Ends call on doctor's side with a notification for doctor
        // Alert to double confirm on choice
        Alert.alert(
            'Are you sure?',
            'You will have to queue again to come back to this page.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Alert Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Leave Room',
                    onPress: () => router.push('/booking'),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.pageContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <Text style={styles.headerText}>Waiting Room</Text>
                    <Text style={styles.normalText}>
                        The doctor is preparing for your consultation. An email with the call link will be sent to you shortly.
                    </Text>
                    <Text style={styles.normalText}>Call URL:</Text>
                </View>
            </TouchableWithoutFeedback>
            <TextInput
                style={styles.input}
                value={callUrl}
                onChangeText={setcallUrl}
                placeholder="Paste your link here"
                multiline={true}
            />
            <Button
                mode='contained'
                style={styles.firstButton}
                onPress={() => router.push('/mentalCall')}
                labelStyle={{ fontSize: 18 }}
                disabled={(callUrl === '') ? true : false}
               
            >
                Join Call
            </Button>
            <Button
                mode='contained'
                style={styles.secondButton}
                onPress={handleLeaveRoom}
                labelStyle={{ fontSize: 18 }}
            >
                Leave Room
            </Button>
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
        marginTop: 115,
        alignSelf: 'center',
        width: 200
    },
    secondButton: {
        width: 200,
        marginTop: 15,
        alignSelf: 'center',
    },
})