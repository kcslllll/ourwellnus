import { View, StyleSheet} from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const router = useRouter();

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
            setErrMsg('Please fill in your password');
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
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                clearButtonMode='always'
            />
            {errMsg !== '' && <Text style={{color: 'purple'}}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Button onPress={handleRegister} mode='elevated' style={styles.createContainer}>Create Account</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        padding: 15,
        backgroundColor: 'white'
    },
    createContainer: {
        marginBottom: 150,
        marginTop: 60,
        width: 200,
        alignSelf: 'center'
    }
})