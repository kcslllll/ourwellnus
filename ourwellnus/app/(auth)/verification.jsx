import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Verification() {
    return (
        <View style={styles.container}>
            <Text style={{marginTop: 275,fontSize: 30, textAlign: 'center'}}>An email has been sent to you for verification.</Text>
            <Link href = "/login" style={{alignSelf: "center", marginTop: 20, marginBottom: 320}}>
                <Button mode='elevated'>Back to Login</Button>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        padding: 14
    },
})
