import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link } from "expo-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('')

    // Actions when Login button is pressed
    const handleSubmit = async () => {
        if (email == '') {
            setErrMsg('NUS email.');
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
            <Text style={{marginTop: 65, fontSize:16}}>NUS Email:</Text>
            <TextInput 
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                clearButtonMode='always'
            />
            <Text style={{marginTop: 20, fontSize:16}}>Password:</Text>
            <TextInput 
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                clearButtonMode='always'
            />
            {errMsg !== '' && <Text style={{color: 'purple'}}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Button onPress={handleSubmit} mode='elevated' style={styles.loginContainer} >Login</Button>
            <Text style={{marginTop: 120, alignSelf: 'center', fontSize: 16}}>New User?</Text>
            <Link href = "/register" style={{alignSelf: "center"}}>
                <Button>Register</Button>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        padding: 15,
        backgroundColor: 'white'
    },
    loginContainer: {
        marginTop: 40,
        width: 150,
        alignSelf: 'center'
    }
})