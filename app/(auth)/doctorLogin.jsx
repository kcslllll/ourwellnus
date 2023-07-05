import { View, StyleSheet, Pressable } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Ionicons } from '@expo/vector-icons';

/*  Forgot password
<Link href="/forgotPassword" asChild>
    <Button>Forgot Password?</Button>
</Link>
*/

export default function StudentLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const { hidePassword, eyeIcon, handlePasswordVisibility } = useTogglePasswordVisibility();

    function useTogglePasswordVisibility() {
        const [hidePassword, setHidePassword] = useState(true);
        const [eyeIcon, setEyeIcon] = useState('ios-eye-outline');

        const handlePasswordVisibility = async () => {
            if (eyeIcon === 'ios-eye-outline') {
                setEyeIcon('ios-eye-off-outline');
                setHidePassword(false);
            } else if (eyeIcon === 'ios-eye-off-outline') {
                setEyeIcon('ios-eye-outline');
                setHidePassword(true);
            }
        };

        return { hidePassword, eyeIcon, handlePasswordVisibility };
    }


    // Actions when Login button is pressed
    const handleSubmit = async () => {
        if (email == '') {
            setErrMsg('Please fill in your email.');
            return;
        }

        if (password == '') {
            setErrMsg('Please fill in your password.');
            return;
        }

        setLoading(true);
        // finding correct entry in our database
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{ marginTop: 50, fontSize: 20 }}>Welcome to,</Text>
            <Text style={{ fontSize: 58 }}>Our WellNUS.</Text>
            <Text style={{ marginTop: 100, fontSize: 16 }}>Work Email:</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                clearButtonMode='always'
            />
            <Text style={{ marginTop: 20, fontSize: 16 }}>Password:</Text>
            <TextInput
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
            />
            <View style={styles.optionsContainer}>
                
                <Pressable onPress={handlePasswordVisibility}>
                    <Ionicons name={eyeIcon} size={24} color="#232323" />
                </Pressable>
            </View>
            {errMsg !== '' && <Text style={{ color: 'purple' }}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Button onPress={handleSubmit} mode='elevated' style={styles.loginContainer} >Login</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 14
    },
    loginContainer: {
        marginTop: 50,
        width: 150,
        alignSelf: 'center',
        marginBottom: 10
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})