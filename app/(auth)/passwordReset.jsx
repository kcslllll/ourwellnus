import { View, StyleSheet, Alert} from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function PasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const router = useRouter();

    // Actions when 'Reset' button is pressed
    const handleReset = async () => {
        if (newPassword === '') {
            setErrMsg('Please fill in your new password.');
            return;
        }

        if (confirmNewPassword === '') {
            setErrMsg('Please confirm your new password.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setErrMsg('Password does not match.')
        }

        setLoading(true);
        // adding the login credentials in our database
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        } else {
            Alert.alert('Password reset successful!');
            router.push("/login");
        }
    }


    return (
        <View style={styles.container}>
            <Text style={{marginTop: 100, fontSize: 36, alignSelf: 'center'}}>Reset your password.</Text>
            <Text style={{marginTop: 40, fontSize: 16}}>New Password:</Text>
            <TextInput 
                secureTextEntry
                autoCapitalize='none'
                textContentType='newPassword'
                value={newPassword}
                onChangeText={setNewPassword}
                clearButtonMode='always'
            />
            <Text style={{marginTop: 30, fontSize: 16}}> Confirm New Password:</Text>
            <TextInput 
                secureTextEntry
                autoCapitalize='none'
                textContentType='newPassword'
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                clearButtonMode='always'
            />
            {errMsg !== '' && <Text style={{color: 'purple'}}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Button onPress={handleReset} mode='elevated' style={styles.resetContainer}>Change Password</Button>
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
    resetContainer: {
        marginBottom: 150,
        marginTop: 40,
        width: 200,
        alignSelf: 'center'
    }
})