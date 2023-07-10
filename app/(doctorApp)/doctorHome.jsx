import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import { Ionicons } from '@expo/vector-icons';

export default function DoctorHome() {
    const { user } = useAuth();
    const router = useRouter();
    const [doctorName, setDoctorName] = useState('');

    // Displays name of user at the top of the home page
    useEffect(() => {
        let ignore = false;

        if (user === null) {
            ignore = true;
        }

        async function FetchName() {
            if (!ignore) {
                const { data } = await supabase.from('uhc_doctors').select('username').eq('user_id', user.id);
                //console.log(data)
                setDoctorName(data[0].username);
            }
        }

        FetchName();
    })

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Button style={styles.logoutContainer} onPress={() => supabase.auth.signOut()}>Logout</Button>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.nameText}>{doctorName},</Text>
            <View style={styles.roundedContainer}>
                <TouchableOpacity style={styles.section} onPress={() => router.push('/doctorConsultation')}>
                    <View style={styles.subSection}>
                        <Text style={styles.subSectionTitle}>Start a Consultation</Text>
                        <View style={styles.arrowBackground}>
                            <Ionicons name="arrow-forward" size={24} color="black" />
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.section}>
                    <View style={styles.subSection}>
                        <Text style={styles.subSectionTitle}>Prescribe Medication</Text>
                        <View style={styles.arrowBackground}>
                            <Ionicons name="arrow-forward" size={24} color="black" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    logoutContainer: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20
    },
    welcomeText: {
        padding: 20,
        fontSize: 20
    },
    nameText: {
        paddingHorizontal: 20,
        fontSize: 38,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
    },
    roundedContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        margin: 20,
        marginTop: 50,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        width: '100%',
        backgroundColor: 'lightgray',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30
      },
    subSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      subSectionTitle: {
        flex: 1,
        fontSize: 18,
      },
      arrowBackground: {
        backgroundColor: 'white',
        borderRadius: 7,
        padding: 5
      },
})