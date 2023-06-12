import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { supabase } from "../lib/supabase";

export default function HomePage() {
    return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Text>This is the HomePage.</Text>
                <Button onPress = {() => supabase.auth.signOut()}>Logout</Button>
            </View>
    )
}