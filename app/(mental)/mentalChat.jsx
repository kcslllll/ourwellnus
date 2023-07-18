import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { GiftedChat } from 'react-native-gifted-chat';
import { useState, useEffect, useCallback } from "react";

export default function MentalChat() {
    const router = useRouter();

    const [messages, setMessages] = useState([])
    const [chatName, setChatName] = useState('Therapist Name');

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
        router.push("/mentalEndChat");
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <View style={styles.headerContainer}>
                <Button textColor="white" onPress={handleLeaveChat}>
                    Leave Chat
                </Button>
            </View>
            <Text style={styles.chatNameText}>{chatName}</Text>
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
        height: 45,
        justifyContent: 'flex-end',
        flexDirection: 'row',
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