import { Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function MedicationCollection() {
    const router = useRouter();
    const {user} = useAuth();
    
    const handleSelectMode = async () => {
        const { data, error } = await supabase.from('user_profile').select('medication_prescribed').eq('user_id', user.id);
        if (error) {
            console.log(error.message);
            return;
        }
        console.log(data[0].medication_prescribed);
        if (data[0].medication_prescribed == null) {
            Alert.alert(
                'Unable to proceed...',
                'There is no medications prescribed for you that needs to be collected.',
                [
                    {
                        text: 'OK',
                    }
                ]
            )
        } else {
            router.push('/selfPickUp');
        }
        return;
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <TouchableOpacity style={styles.backContainer} onPressIn={() => router.replace('/summary')}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Medication Collection</Text>
            <Text style={styles.subHeaderText}>
                Please book a time for you to head down{'\n'}
                to UHC to pick your medication up.
            </Text>
            <Button 
                mode='contained' style={{ marginTop: 40, justifyContent: 'center', height: 60}} 
                labelStyle={{ fontSize: 21 }} 
                onPress={handleSelectMode}
            >
                Book now
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
        marginTop: 130,
        fontSize: 45,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        marginBottom: 20,
        marginTop: 40,
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
        justifyContent: 'center'
    },
})