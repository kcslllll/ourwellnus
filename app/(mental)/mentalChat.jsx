import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { GiftedChat } from 'react-native-gifted-chat';
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function MentalChat() {
    const router = useRouter();
    const { user } = useAuth();
    const params = useLocalSearchParams();

    const [messages, setMessages] = useState([])
    const [chatName, setChatName] = useState('Therapist Name');

    useEffect(() => {
        // fetch therapist name from rooms table
        async function fetchTherapist() {
            const { data, error } = await supabase.rpc('get_room_owner', {room_id: params.roomId});
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data);
                setChatName(data);
            }
        }
        fetchTherapist();
    },[params.roomId])

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
        // fetch all messages from that specifc room
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', params.roomId)
                .order('created_at', { ascending: false });
            if (!data) {
                console.log('no messages');
                return;
            }
            //console.log(messages);
            setMessages(data.map(message => mapMessages(message)));
        }
        fetchMessages();
    }, [params.roomId])

    useEffect(() => {
        // subscribe to changes in messages table
        const subscription = supabase
            .channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: `messages` }, payload => {
                console.log('Change received!');
                if (payload.new.room_id == params.roomId) {
                    setMessages(previousMessages =>
                        GiftedChat.append(previousMessages, mapMessages(payload.new)),
                    );
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        }
    }, [params.roomId])

    const onSend = useCallback((newMessage = []) => {
        //Inserts new message into supabase
        const insert = async () => {
            const { error } = await supabase
                .from('messages')
                .insert({
                    room_id: params.roomId,
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
    }, [params.roomId, user.id])


    const handleLeaveChat = async () => {
        // delete user from the room in room_participants table
        const {error} = await supabase.from('room_participants').delete().eq('user_id', user.id);
        if (error) {
            console.log(error.message);
            return;
        }
        router.push("/mentalEndChat");
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
                    user={mapUser(user.id)}
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