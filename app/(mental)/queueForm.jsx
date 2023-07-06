import { Text, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";


export default function QueueForm() {
    const router = useRouter();
    const [firstDoc, setFirstDoc] = useState('');
    const [secondDoc, setSecondDoc] = useState('');
    const [nameSelected, setNameSelected] = useState('');
    const [issueSelected, setIssueSelected] = useState('');

    useEffect(() => {
        async function fetchDoc() {
            const { data } = await supabase
                .from('ucs_therapists')
                .select('username');
            //console.log(data[0].username);
            setFirstDoc(data[0].username);
            setSecondDoc(data[1].username);
        }
        fetchDoc();
    }, [])

    // Mock data but will connect to our database
    const therapistData = [
        { key: '1', value: 'No Preference' },
        { key: '2', value: firstDoc },
        { key: '3', value: secondDoc },
    ]

    // Mock data but will connect to our database
    const issuesData = [
        { key: '1', value: 'Family' },
        { key: '2', value: 'Relationship' },
        { key: '3', value: 'School' },
        { key: '4', value: 'Career' },
        { key: '5', value: 'Life Advice' },
        { key: '6', value: 'Others' },
    ]

    const handleFormNext = async () => {
        // Save the data selected for the user, use it for future pages
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Pressable style={styles.backContainer} onPressIn={() => router.push('/booking')}>
                <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
            </Pressable>
            <Text style={styles.headerText}>Mental Health Consultation</Text>
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Select your preferred therapist:</Text>
                <SelectList
                    boxStyles={{ backgroundColor: '#FFFFFF' }}
                    dropdownStyles={{ backgroundColor: '#FFFFFF' }}
                    setSelected={(val) => setNameSelected(val)}
                    data={therapistData}
                    save="value"
                />
            </View>
            <View style={styles.secondQuestionContainer}>
                <Text style={styles.questionText}>Select the issues you wish to address:</Text>
                <MultipleSelectList
                    boxStyles={{ backgroundColor: '#FFFFFF' }}
                    dropdownStyles={{ backgroundColor: '#FFFFFF' }}
                    setSelected={(val) => setIssueSelected(val)}
                    data={issuesData}
                    save="value"
                    label="Selected"
                />
            </View>
            <Link href={{ pathname: "/mentalQueue", params: { name: nameSelected, issue: issueSelected } }} asChild>
                <Button
                    mode='contained'
                    style={styles.buttonContainer}
                    labelStyle={{ fontSize: 18 }}
                    onPress={handleFormNext}
                    disabled={(nameSelected === '') || (issueSelected === '') ? true : false}
                >
                    Next
                </Button>
            </Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    backContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        marginTop: 10
    },
    headerText: {
        marginTop: 20,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS',
        textAlign: 'center',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '300',
        fontFamily: 'Trebuchet MS',
        textAlign: 'left',
        marginBottom: 10
    },
    questionContainer: {
        marginTop: 80,
        padding: 30
    },
    secondQuestionContainer: {
        padding: 30
    },
    buttonContainer: {
        marginTop: 20,
        alignSelf: 'center',
        width: 150
    }
})