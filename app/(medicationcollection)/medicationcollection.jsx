import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//import { supabase } from "../../lib/supabase";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MedicationCollection() {
    const router = useRouter();
    
    const handleSelectMode = () => {
        router.push('/modeOfCollection');
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <TouchableOpacity style={styles.backContainer} onPressIn={() => router.back()}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Medication Collection</Text>
            <Text style={styles.subHeaderText}>In order to help you recover as soon {'\n'} 
            as possible, we have prescribed you with {'\n'}
            the medication you need. Please book a {'\n'}
            time for you to head down to UHC to pick {'\n'}
            it up, or book a time which you would {'\n'}
            like your medication to be delivered to you.</Text>
            <Button 
                mode='contained' style={{ marginTop: 40, backgroundColor: 'green', justifyContent: 'center', height: 60}} 
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
        marginTop: 100,
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