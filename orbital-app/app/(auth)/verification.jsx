import { Link } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function VerificationPage() {
    return (
        <View style={{justifyContent: "center", backgroundColor: 'white'}}>
            <Text style={{marginTop: 275,fontSize: 30, textAlign: 'center'}}>An email has been sent to you for verification.</Text>
            <Link href = "/login" style={{alignSelf: "center", marginTop: 20, marginBottom: 320}}>
                <Button mode='elevated'>Back to Login</Button>
            </Link>
        </View>
    )
}