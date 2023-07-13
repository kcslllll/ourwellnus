import { StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserIdentity() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginTop: 40, fontSize: 20 }}>Welcome to,</Text>
            <Text style={styles.headerText}>Our WellNUS.</Text>
            <Link href='/studentLogin' asChild>
                <Button mode='contained' style={styles.studentContainer} labelStyle={{fontSize: 18}}>NUS Students</Button>
            </Link>
            <Link href='/doctorLogin' asChild>
                <Button mode='contained' style={styles.doctorContainer} labelStyle={{fontSize: 18}}>UHC Doctors</Button>
            </Link>
            <Link href='/therapistLogin' asChild>
                <Button mode='contained' style={styles.doctorContainer} labelStyle={{fontSize: 18}}>UCS Therapists</Button>
            </Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 14
    },
    studentContainer: {
        marginTop: 160,
        width: 250,
        alignSelf: 'center'
    },
    doctorContainer: {
        marginTop: 20,
        width: 250,
        alignSelf: 'center'
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerText: {
        fontSize: 59, 
        marginTop: 10,
    }
});