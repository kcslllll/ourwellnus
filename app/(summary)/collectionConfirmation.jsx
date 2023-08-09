import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function CollectionConfirmation() {
    const router = useRouter();
    const { user } = useAuth();
    const param = useLocalSearchParams();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [medication, setMedication] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchUserName() {
            const { data, error } = await supabase
                .from('user_profile')
                .select('name')
                .eq('user_id', user.id);
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data[0].name);
                setUserName(data[0].name);
            }
        }
        async function fetchUserEmail() {
            const { data, error } = await supabase
                .from('user_profile')
                .select('email')
                .eq('user_id', user.id);
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data[0].email);
                setUserEmail(data[0].email);
            }
        }
        async function fetchMedication() {
            const { data } = await supabase
                .from('user_profile')
                .select('medication_prescribed')
                .eq('user_id', user.id);
            if (!data[0].medication_prescribed) {
                setMedication('No medication prescribed...');
            } else {
                setMedication(data[0].medication_prescribed);
            }
        }
        fetchUserName();
        fetchUserEmail();
        fetchMedication()
    }, [])

    const handleCollected = async () => {
        setLoading(true);
        // delete time slot form database
        const { error } = await supabase
            .from('self_pick_up_collection')
            .delete()
            .match({ user_id: user.id, date_chosen: param.date, time_chosen: param.time });
        if (error) {
            console.log(error.message);
            return;
        } else {
            // update medication prescribed to null
            const { error } = await supabase
                .from('user_profile')
                .update({ medication_prescribed: null })
                .eq('user_id', user.id);
            if (error) {
                console.log(error.message);
                return;
            }
        }
        // redirect back to summary page
        setLoading(false);
        router.back();
        //console.log(param.date + ", " + param.time);
        return;
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Pressable style={styles.backContainer} onPressIn={() => router.back()}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </Pressable>
            <Text style={styles.headerText}>Booking Confirmation</Text>
            <Text style={styles.normalText}>Name:</Text>
            <View style={styles.infoContainer}>
                <Text style={{ paddingHorizontal: 10 }}>{userName}</Text>
            </View>
            <Text style={styles.normalText}>Email:</Text>
            <View style={styles.infoContainer}>
                <Text style={{ paddingHorizontal: 10 }}>{userEmail}</Text>
            </View>
            <Text style={styles.normalText}>Medication Prescribed:</Text>
            <View style={styles.medicationContainer}>
                <Text style={{ padding: 10 }}>{medication}</Text>
            </View>
            <Button mode='contained' onPress={handleCollected} style={styles.buttonContainer} labelStyle={{ fontSize: 18 }}>
                Collected
            </Button>
            {loading && <ActivityIndicator />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    backContainer: {
        paddingHorizontal: 15
    },
    headerText: {
        marginTop: 30,
        fontSize: 33,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    normalText: {
        marginTop: 30,
        paddingHorizontal: 20,
        fontSize: 16,
        fontFamily: 'Trebuchet MS',
    },
    infoContainer: {
        marginTop: 15,
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
    medicationContainer: {
        marginTop: 15,
        width: 330,
        height: 200,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        alignSelf: "center"
    },
    buttonContainer: {
        width: 200,
        alignSelf: 'center',
        marginTop: 50,
    }
})