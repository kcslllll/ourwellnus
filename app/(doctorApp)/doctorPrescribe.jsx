import { Text, StyleSheet, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Keyboard } from "react-native";

export default function DoctorPrescribe() {
    const router = useRouter();
    const param = useLocalSearchParams();
    const [patientName, setPatientName] = useState('');
    const [medication, setMedication] = useState('');

    useEffect(() => {
        async function fetchPatientName() {
            const { data, error } = await supabase
                .from('user_profile')
                .select('name')
                .eq('user_id', param.patientId);
            if (error) {
                console.log(error.message);
            } else {
                //console.log(data[0].name);
                setPatientName(data[0].name);
            }
        }
        fetchPatientName();
    }, [param.patientId])

    async function updateMedication() {
        const { error } = await supabase
            .from('user_profile')
            .update({ medication_prescribed: medication })
            .eq('user_id', param.patientId)
        if (error) {
            console.log(error.message);
        } else {
            router.push('/doctorConsultation');
        }
        return;
    }

    const handleSubmit = async () => {
        // Update medication_prescribed for patient in database     
        Alert.alert(
            'Are you sure?',
            'Please make sure you have indicated the correct medication prescription before proceeding.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => updateMedication()
                },
            ]
        )
        return;
    }


return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.pageContainer}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <Pressable style={styles.backContainer} onPressIn={() => router.back()}>
                    <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
                </Pressable>
                <Text style={styles.headerText}>Prescribe Medication</Text>
                <Text style={styles.subheaderText}>Patient Name:</Text>
                <View style={styles.infoContainer}>
                    <Text style={{ paddingHorizontal: 10 }}>{patientName}</Text>
                </View>
                <Text style={styles.subheaderText}>Medicine to prescribe:</Text>
            </View>
        </TouchableWithoutFeedback>

        <TextInput
            multiline
            editable
            style={styles.inputContainer}
            value={medication}
            onChangeText={setMedication}
            placeholder="Input your medications here..."
        />

        <Button mode='contained' onPress={handleSubmit} style={styles.submitContainer} labelStyle={{ fontSize: 18 }}>
            Submit
        </Button>
    </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    backContainer: {
        marginTop: 45,
        paddingHorizontal: 15
    },
    headerText: {
        marginTop: 40,
        fontSize: 33,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    subheaderText: {
        marginTop: 50,
        paddingHorizontal: 20,
        fontSize: 16,
        fontFamily: 'Trebuchet MS',
    },
    normalText: {
        marginTop: 40,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    inputContainer: {
        backgroundColor: 'white',
        height: 200,
        margin: 20,
        borderRadius: 10,
        padding: 10,
        paddingTop: 10,
        borderWidth: 1.5,
        borderColor: '#855EB7',
    },
    infoContainer: {
        marginTop: 20,
        width: 330,
        height: 50,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: "center"
    },
    submitContainer: {
        width: 200,
        alignSelf: 'center',
        marginTop: 30,
    }
})