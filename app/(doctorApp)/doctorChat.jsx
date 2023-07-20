import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GiftedChat } from 'react-native-gifted-chat';
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function DoctorChat() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useLocalSearchParams();

    const [messages, setMessages] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const [patientInvited, setPatientInvited] = useState(false);

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

    useEffect(() => {
        async function fetchRoomId() {
            const {data, error} = await supabase.from('room_participants').select('room_id').eq('user_id', user.id);
            if (error) {
                console.log(error.message);
                return;
            } 
            if (data.length === 0) {
                //console.log('data is empty');
                return;
            } else {
                //console.log(data);
                setRoomId(data[0].room_id);
                return;
            }
        }
        fetchRoomId();
    },[user.id, router])

    const handleInvitePatient = async () => {
        // Adds patient as one of the room participants
        const { error } = await supabase
            .from('room_participants')
            .insert({room_id: roomId, user_id: params.patientId})
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
            router.push("/doctorConsultation");
            return;
        }
    }

    const handleVideoSession = async () => {

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
                    user={{
                        _id: 1,
                        name: 'doctor'
                    }}
                />
            </View>
            <Button textColor="white" onPress={handleLeaveChat} labelStyle={{fontSize: 20}} style={styles.leaveButton}>
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