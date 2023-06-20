import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";
import { useState } from "react";
import { Button } from "react-native-paper";
import { Link } from "expo-router";

export default function QueueForm() {
    const [selected, setSelected] = useState('');
    const [data, setData] = useState(null);

    // Mock data but will connect to our database
    const therapistData = [
        { key: '1', value: 'No Preference' },
        { key: '2', value: 'Dr Chan Boo Chan' },
        { key: '3', value: 'Dr Goh Chee Yen' },
        { key: '4', value: 'Dr Susan Lim' },
        { key: '5', value: 'Dr Lim Chong Yee' },
    ]

    // Mock data but will connect to our database
    const issuesData = [
        { key: '1', value: 'Family' },
        { key: '2', value: 'Relationship' },
        { key: '3', value: 'School' },
        { key: '4', value: 'Life Advice' },
        { key: '5', value: 'Others' },
    ]

    const handleFormNext = async () => {
        // Save the data selected for the user, use it for future pages
    }

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Text style={styles.headerText}>Mental Health Consultation</Text>
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Select your preferred therapist:</Text>
                <SelectList
                    boxStyles={{ backgroundColor: '#FFFFFF' }}
                    dropdownStyles={{ backgroundColor: '#FFFFFF' }}
                    setSelected={(val) => setSelected(val)}
                    data={therapistData}
                    save="value"
                    defaultOption={{ key: '1', value: 'No Preference' }}
                />
            </View>
            <View style={styles.secondQuestionContainer}>
                <Text style={styles.questionText}>Select the issues you wish to address:</Text>
                <MultipleSelectList
                    boxStyles={{ backgroundColor: '#FFFFFF' }}
                    dropdownStyles={{ backgroundColor: '#FFFFFF' }}
                    setSelected={(val) => setSelected(val)}
                    data={issuesData}
                    save="value"
                    label="Selected"
                />
            </View>
            <Link href='/mentalQueue' asChild>
                <Button mode='contained' style={styles.buttonContainer} labelStyle={{ fontSize: 18 }} onPress={handleFormNext}>Next</Button>
            </Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#e9d3ff',
    },
    headerText: {
        marginTop: 40,
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