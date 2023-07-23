import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, Alert, Linking } from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GiftedChat } from 'react-native-gifted-chat';
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function TherapistChat() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useLocalSearchParams();

    const [messages, setMessages] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const [patientInvited, setPatientInvited] = useState(false);

    function mapUser(userId) {
        //reformats user object from supabase to GiftedChat
        return {
            _id: userId,
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJQbBE6lkySTbbqKaKE3C9x8kv5Fnevtao4eXj2y8AJ5d6zJCyTvOkoUdiagFdoQt6H40&usqp=CAU://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJQbBE6lkySTbbqKaKE3C9x8kv5Fnevtao4eXj2y8AJ5d6zJCyTvOkoUdiagFdoQt6H40&usqp=CAU'
        };
    }

    function mapMessages(message) {
        //reformats message object from supabase to GiftedChat
        //console.log(message)
        return {
            _id: message.message_id,
            text: message.content,
            createdAt: new Date(message.created_at),
            user: mapUser(message.user_id),
        };
    }

    useEffect(() => {
        async function fetchRoomId() {
            const { data, error } = await supabase.from('room_participants').select('room_id').eq('user_id', user.id);
            if (error) {
                console.log(error.message);
                return;
            }
            if (data.length === 0) {
                console.log('data is empty');
                return;
            } else {
                console.log(data);
                setRoomId(data[0].room_id);
                return;
            }
        }
        setTimeout(() => fetchRoomId(), 500);
    }, [])

    useEffect(() => {
        // fetch all messages from that specifc room
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: false });
            if (!data) {
                console.log('no messages');
                return;
            }
            //console.log(messages);
            setMessages(data.map(message => mapMessages(message)));
        }
        fetchMessages
    }, [roomId])

    useEffect(() => {
        // subscribe to changes in messages table
        const subscription = supabase
            .channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: `messages` }, payload => {
                console.log('Change received!');
                if (payload.new.room_id == roomId) {
                    setMessages(previousMessages =>
                        GiftedChat.append(previousMessages, mapMessages(payload.new)),
                    );
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        }
    }, [roomId])

    const onSend = useCallback((newMessage = []) => {
        //Inserts new message into supabase
        const insert = async () => {
            const { error } = await supabase
                .from('messages')
                .insert({
                    room_id: roomId,
                    user_id: user.id,
                    content: newMessage[0].text
                })
            if (error) {
                console.log(error.message);
                return;
            }
            return;
        }
        insert();
    }, [user.id, roomId])

    const handleInvitePatient = async () => {
        // Adds patient as one of the room participants
        const { error } = await supabase
            .from('room_participants')
            .insert({ room_id: roomId, user_id: params.patientId })
        if (error) {
            console.log(error.message);
            return;
        }
        setPatientInvited(true);
        return;
    }

    const handleLeaveChat = async () => {
        // delete room from rooms table
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('room_owner_id', user.id)
        if (error) {
            console.log(error.message);
            return;
        } else {
            router.push("/therapistConsultation");
            return;
        }
    }

    const handleVideoSession = async () => {
                // Alerts doctor that he needs to come back to leave chat
        //Insert system message to inform patient doctor is creating video session
        //Redirects doctor to zoom
        const systemMessage = [{
            text: 'Doctor is starting video session...'
        }];

        Alert.alert(
            'You will now be redirected to Zoom...',
            'You may return this chat room to share the meeting information. Do remember to leave this chat room after the video session!',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', 
                    onPress: () => {
                        onSend(systemMessage);
                        Linking.openURL('https://zoom.us/signin#/login');
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <View style={styles.headerContainer}>
                <Button
                    textColor="white"
                    onPress={handleInvitePatient}
                    disabled={patientInvited ? true : false}
                >
                    Invite Patient
                </Button>
                <Button textColor="white" onPress={handleVideoSession}>
                    Start Video-session
                </Button>
            </View>
            <Text style={styles.chatNameText}>{params.patientName}</Text>
            <View style={styles.messageContainer}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={mapUser(user.id)}
                />
            </View>
            <Button textColor="white" onPress={handleLeaveChat} labelStyle={{ fontSize: 20 }} style={styles.leaveButton}>
                Leave Chat
            </Button>
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
        height: 590
    },
    leaveButton: {
        marginTop: 10
    }
})