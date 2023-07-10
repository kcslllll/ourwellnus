import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function TherapistCall() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text> This is the call page.</Text>
            <Button onPress={() => router.push("/therapistConsultation")}>Leave Call</Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
        justifyContent: 'center',
        alignItems: 'center'
    },
})