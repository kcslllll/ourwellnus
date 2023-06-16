import { View, StyleSheet, Pressable } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link } from "expo-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const {hidePassword, eyeIcon, handlePasswordVisibility} = useTogglePasswordVisibility();
    
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

        return {hidePassword, eyeIcon, handlePasswordVisibility};
    }


    // Actions when Login button is pressed
    const handleSubmit = async () => {
        if (email == '') {
            setErrMsg('Please fill in your NUS email.');
            return;
        }

        if (password == '') {
            setErrMsg('Please fill in your password.');
            return;
        }

        if (email.slice(-10) != '@u.nus.edu') {
            setErrMsg('Invalid email!');
            return;
        }

        setLoading(true);
        // finding correct entry in our database
        const { error } = await supabase.auth.signInWithPassword({email, password});
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{marginTop: 100, fontSize: 20}}>Welcome,</Text>
            <Text style={{fontSize: 58}}>Our WellNUS.</Text>
            <Text style={{marginTop: 55, fontSize:16}}>NUS Email:</Text>
            <TextInput 
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                clearButtonMode='always'
            />
            <Text style={{marginTop: 20, fontSize:16}}>Password:</Text>
            <TextInput 
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
            />
            <Pressable onPress={handlePasswordVisibility}>
                <Ionicons name={eyeIcon} size={24} color="#232323"/>
            </Pressable>
            <Link href="/forgotPassword" style={{alignSelf:'flex-end'}}>
                <Button>Forgot Password?</Button>
            </Link>
            {errMsg !== '' && <Text style={{color: 'purple'}}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Button onPress={handleSubmit} mode='elevated' style={styles.loginContainer} >Login</Button>
            <Text style={{marginTop: 110, alignSelf: 'center', fontSize: 16}}>New User?</Text>
            <Link href = "/register" style={{alignSelf: "center"}}>
                <Button>Register</Button>
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
    loginContainer: {
        marginTop: 10,
        width: 150,
        alignSelf: 'center'
    }
})