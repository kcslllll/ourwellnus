import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GiftedChat } from 'react-native-gifted-chat';
import { useState, useEffect, useCallback } from "react";

export default function TherapistChat() {
    const router = useRouter();
    const param = useLocalSearchParams();

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Doctor Lee',
                },
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
    }, [])

    const handleLeaveChat = async () => {
        router.push("/therapistConsultation");
    }

    const handleVideoSession = async () => {

    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <View style={styles.headerContainer}>
                <Button textColor="white" onPress={ handleLeaveChat }>
                    Leave Chat
                </Button>
                <Button textColor="white" onPress={ handleVideoSession }>
                    Start Video-session
                </Button>
            </View>
            <Text style={styles.chatNameText}>{ param.patientName }</Text>
            <View style={styles.messageContainer}>
            <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                        name: 'doctor'
                    }}
                />
            </View>
 

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#855EB7',
    },
    headerContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    chatNameText: {
        fontSize: 36,
        fontWeight: '500',
        fontFamily: 'Trebuchet MS',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    messageContainer: {
        backgroundColor: '#e9d3ff',
        height: 615
    }
})