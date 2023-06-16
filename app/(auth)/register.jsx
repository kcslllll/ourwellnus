import { View, StyleSheet, Pressable } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const router = useRouter();
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

    // Actions when 'Create Account' button is pressed
    const handleRegister = async () => {
        if (name == '') {
            setErrMsg('Please fill in your name.');
            return;
        }

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
        // adding the login credentials in our database
        const { error } = await supabase.auth.signUp({name, email, password});
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        } else {
            router.push("/verification");
        }
    }


    return (
        <View style={styles.container}>
            <Text style={{marginTop: 90, fontSize: 36, alignSelf: 'center'}}>Create an account.</Text>
            <Text style={{marginTop: 50}}>Name:</Text>
            <TextInput 
                autoCapitalize='none'
                textContentType='name'
                value={name}
                onChangeText={setName}
                clearButtonMode='always'
            />
            <Text style={{marginTop: 20}}>NUS Email:</Text>
            <TextInput 
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                clearButtonMode='always'
            />
            <Text style={{marginTop: 20}}>Password:</Text>
            <TextInput 
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                clearButtonMode='always'
            />
            <Pressable onPress={handlePasswordVisibility}>
                <Ionicons name={eyeIcon} size={24} color="#232323"/>
            </Pressable>
            {errMsg !== '' && <Text style={{color: 'purple'}}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Button onPress={handleRegister} mode='elevated' style={styles.createContainer}>Create Account</Button>
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
    createContainer: {
        marginBottom: 150,
        marginTop: 60,
        width: 200,
        alignSelf: 'center'
    }
})