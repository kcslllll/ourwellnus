import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GiftedChat } from 'react-native-gifted-chat';
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function PhysicalChat() {
    const router = useRouter();
    const { user } = useAuth();
    const params = useLocalSearchParams();

    const [messages, setMessages] = useState([])
    const [chatName, setChatName] = useState('Doctor Name');

    useEffect(() => {
        // fetch doctor name from rooms table
        /*async function fetchDoctor() {
            const { data, error } = await supabase.rpc('get_room_owner', {room_id: params.roomId});
            if (error) {
                console.log(error.message);
            } else {
                setChatName(data.name)
            }
        }*/
    })

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
        ]);
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
    }, [])

    const handleLeaveChat = async () => {
        // delete user from the room in room_participants table
        const {error} = await supabase.from('room_participants').delete().eq('user_id', user.id);
        if (error) {
            console.log(error.message);
            return;
        }
        router.push("/physicalEndChat");
        return;
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