/**
 * @file CardDescriptionScreen for RefCard
 * @author Ibrahim Eraslan <ibrahim.eraslan@mni.thm.de>
 */

import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-paper'
import firebase from "firebase/compat";
//import {LinearGradient} from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";

import stylejs from "../style";


const CreateCard = (props) => {
    const [answer, setAnswer] = useState("")
    const [question, setQuestion] = useState("")

    const navigation = useNavigation()
    const id = props.route.params.id
    const categoryColor = props.route.params.categoryColor;
    const catId = props.route.params.catId
    const title = props.route.params.titel

    /**
     * @description Adds the question to the current set
     * @returns {Promise<void>}
     */
    const createQuestion = async () => {
        await firebase.firestore()
            .collection('category')
            .doc(catId)
            .collection("set")
            .doc(id)
            .collection("card")
            .add({
                question: question,
                answer: answer,
                date: new Date(),
                box: 1
            }).then(() => {
                setQuestion("");
                setAnswer("");
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            {/*Cancel-, Info- and User-Icon*/}
            <SafeAreaView style={[stylejs.headerNew, {width: "100%", alignItems: "flex-start", justifyContent: "center", top: -50}]}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Main');
                    }}
                    style={{flex:1}}
                >
                    <Icon name='chevron-back-sharp' size={50} color= '#FD4365' style={{marginTop: -15}}/>
                </TouchableOpacity>
                <Text style={[stylejs.headerText, {textAlign: "center"}]}>CREATE CARDS</Text>
                <Text style={{flex: 1}}></Text>
            </SafeAreaView>
            <Text style={[stylejs.headerText, {textAlign: "center", flex: 1}]}>{title}</Text>
            {/*<LinearGradient
                colors={[categoryColor.left, categoryColor.right]}
                style={styles.inputContainer}
            >*/}
                <View style={styles.inputContainer2}>
                <Text style={[styles.inputTitle, {marginTop: 10, color: 'white'},]}>Question:</Text>
                <TextInput
                    testID={"QuestionTextInput"}
                    multiline
                    value={question}
                    style={[styles.inputBox, {marginBottom: 10}]}
                    returnkeyType='Done'
                    onChangeText={(val) => setQuestion(val)}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 1, height: 3, backgroundColor: 'white'}}/>
                </View>
                <Text style={[styles.inputTitle, {color: 'white'}]}>Answer:</Text>
                <TextInput
                    testID={"AnswerTextInput"}
                    multiline
                    value={answer}
                    style={[styles.inputBox, {marginBottom: 10}]}
                    returnkeyType='Done'
                    onChangeText={(val) => setAnswer(val)}
                />
            </View>
            {/*</LinearGradient>>*/}
            <Button
                style={stylejs.defaultButton}
                onPress={() => {
                    createQuestion().then(() => console.log("Question successfully created"));
                }}>
                <Text style={[stylejs.modal_text, {color: "white"}]}>Create</Text>
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        top:30,
    },
    inputContainer: {
        width: '95%',
        height: '65%',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 15,        
    },
    inputContainer2: {
        width: '95%',
        height: '65%',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 15,
        backgroundColor:'blue'
    },
    inputBox: {
        borderRadius: 20,
        width: '90%',
        height: '30%',
        color: 'white',
    },
    inputTitle: {
        fontSize: 18,
        alignSelf: 'flex-start',
        marginLeft: 15,
    },
});

export default CreateCard
