import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TherapistStart() {
    const router = useRouter();
    const [patientId, setPatientId] = useState(null)
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientIssue, setPatientIssue] = useState('');

    useEffect(() => {
        async function fetchPatientId() {
            const { data, error } = await supabase
                .from('mental_queue')
                .select('user_id')
                .limit(1);
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data[0].user_id);
                setPatientId(data[0].user_id);
            }
        }
        async function fetchPatientName(id) {
            const { data, error } = await supabase
                .from('user_profile')
                .select('name')
                .eq('user_id', id);
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data[0].name);
                setPatientName(data[0].name);
            }
        }
        async function fetchPatientEmail(id) {
            const { data, error } = await supabase
                .from('user_profile')
                .select('email')
                .eq('user_id', id);
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data[0].email);
                setPatientEmail(data[0].email);
            }
        }
        async function fetchPatientIssue(id) {
            const { data, error } = await supabase
                .from('mental_queue')
                .select('issue_stated')
                .eq('user_id', id);
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data[0].issue_stated);
                setPatientIssue(data[0].issue_stated);
            }
        }
        fetchPatientId().then(() => {
            fetchPatientName(patientId);
            fetchPatientEmail(patientId);
            fetchPatientIssue(patientId);
        })
    }, [patientId])

    const handleStartCall = async () => {
        // should do the following:
        // create a chat room and join chat automatically
        // add patient as participant of the room
        const { error } = await supabase.rpc('create_chat_room');
        if (error) {
            console.log(error.message);
            return;
        }
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Pressable style={styles.backContainer} onPressIn={() => router.back()}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </Pressable>
            <Text style={styles.headerText}>Mental Health Consultation</Text>
            <Text style={styles.subheaderText}>Patient Information:</Text>
            <Text style={styles.normalText}>Name:</Text>
            <View style={styles.infoContainer}>
                <Text style={{ paddingHorizontal: 10 }}>{patientName}</Text>
            </View>
            <Text style={styles.normalText}>Email:</Text>
            <View style={styles.infoContainer}>
                <Text style={{ paddingHorizontal: 10 }}>{patientEmail}</Text>
            </View>
            <Text style={styles.normalText}>Issues stated:</Text>
            <View style={styles.infoContainer}>
                <Text style={{ paddingHorizontal: 10 }}>{patientIssue}</Text>
            </View>
            <Link
                href={{
                    pathname: '/therapistChat',
                    params: {
                        patientName: patientName,
                        patientId: patientId
                    }
                }} asChild 
            >
                <Button mode='contained' onPress={handleStartCall} style={styles.startContainer} labelStyle={{ fontSize: 18 }}>
                    Start Chat
                </Button>
            </Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    backContainer: {
        paddingHorizontal: 10
    },
    headerText: {
        marginTop: 30,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    subheaderText: {
        marginTop: 70,
        marginBottom: 10,
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
    },
    normalText: {
        marginTop: 20,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    infoContainer: {
        marginTop: 10,
        width: 330,
        height: 50,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignSelf: "center"
    },
    startContainer: {
        width: 200,
        alignSelf: 'center',
        marginTop: 70,
    }
})