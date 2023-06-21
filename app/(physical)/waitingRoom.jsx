import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function waitingRoom() {
    return (
        <SafeAreaView style={styles.pageContainer}>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
})