import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import * as Linking from 'expo-linking';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const router = useRouter();
    const resetPasswordURL = Linking.createURL('/passwordReset');

    // Actions when Continue button is pressed
    const emailReset = async () => {
        if (email == '') {
            setErrMsg('Please fill in your NUS email.');
            return;
        }
        
        if (email.slice(-10) != '@u.nus.edu') {
            setErrMsg('Invalid email!');
            return;
        }

        setLoading(true);

        // Send out password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: resetPasswordURL
        });

        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        } else {
            console.log(resetPasswordURL + 'sent to email')
            router.push('/emailReset');
        }
    };

    return (

        <View style={styles.container}>
            <Text style={{ marginTop: 160, fontSize: 36, alignSelf:'center' }}>Forgot password.</Text>
            <Text style={{ marginTop: 25, fontSize:16 }}>Enter the email address associated with your account.</Text>
            <Text style={{ marginTop: 25, fontSize:16 }}>NUS Email:</Text>
            <TextInput 
                autoCapitalize='none'
                textContentType='emailAddress'
                value={ email }
                onChangeText={ setEmail }
                clearButtonMode='always'
            />
            { errMsg !== '' && <Text style={{ color: 'purple' }}>{ errMsg }</Text> }
            { loading && <ActivityIndicator /> }
            <Button 
                onPress={emailReset} 
                mode='elevated' 
                style={ styles.continueContainer } >Continue</Button>
            <Text style={{ marginTop: 180, alignSelf: 'center', fontSize: 16 }}>New User?</Text>
            <Link href = "/register" style={{ alignSelf: "center" }}>
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
    continueContainer: {
        marginTop: 30,
        width: 150,
        alignSelf: 'center'
    }
})