import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";

export default function Confirmation() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const {user} = useAuth();

    const [loading, setLoading] = useState(false);
    const displayDate = params.date.slice(0, 15);

    const handleThankYou = async () => {
        // log user inputs
        setLoading(true);
        const { error } = await supabase.from('self_pick_up_collection').insert({ user_id: user.id, date_chosen: displayDate, time_chosen: params.time });
        setLoading(false);
        if (error) {
            console.log(error.message);
            return;
        }

        router.push('/thankyou');
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <TouchableOpacity style={styles.backContainer} onPressIn={() => router.back()}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Medication Collection</Text>
            <View style={styles.confirmationContainer}>
                <Text style={styles.confirmationText}>Confirmation:</Text>
                <Text style={{ marginTop: 10, fontSize: 16 }}>Date: {displayDate}</Text>
                <Text style={{ marginTop: 5, fontSize: 16 }}>Time: {params.time}</Text>
            </View>
            {loading && <ActivityIndicator />}
            <Button mode='contained' style={{ marginTop: 50, justifyContent: 'center', width: 150 }}
                labelStyle={{ fontSize: 18 }}
                onPress={handleThankYou}>
                Proceed
            </Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        alignItems: 'center'
    },
    backContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        marginTop: 10
    },
    headerText: {
        marginTop: 20,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        marginBottom: 20,
        marginTop: 70,
        textAlign: 'center'
    },
    roundedRectangle: {
        width: 130,
        height: 110,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
    },
    confirmationContainer: {
        marginTop: 50,
        width: 320,
        height: 150,
        backgroundColor: "#ffffff",
        textColor: "red",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmationText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: "center",
    }
})