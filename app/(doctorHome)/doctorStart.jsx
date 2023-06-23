import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Link } from "expo-router";

export default function DoctorStart() {


    // should be the info of first user in the queue
    const userName = 'Lee Ruo Xuan';
    const userEmail = 'iloveapples@gmail.com';

    const handleStartCall = async () => {
        // should do the following:
        // create room for call and join call automatically

        // send call URL to patient's email
        
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Virtual Consultations</Text>
            <Text style={styles.subheaderText}>Patient Information:</Text>
            <Text style={styles.normalText}>Name:</Text>
            <View style={styles.infoContainer}>
                <Text style={{paddingHorizontal: 10}}>{userName}</Text>
            </View>
            <Text style={styles.normalText}>Email:</Text>
            <View style={styles.infoContainer}>
                <Text style={{paddingHorizontal: 10}}>{userEmail}</Text>
            </View>
            <Link href='/doctorCall' asChild>
            <Button mode='contained' onPress={handleStartCall} style={styles.startContainer} labelStyle={{fontSize: 18}}>Start Call</Button>
            </Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    headerText: {
        marginTop: 50,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        alignSelf: 'center'
    },
    subheaderText: {
        marginTop: 100,
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
    },
    normalText: {
        marginTop: 40,
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