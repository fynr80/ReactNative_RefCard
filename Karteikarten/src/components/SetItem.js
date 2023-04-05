/**
 * @file SetItem of RefCard app
 * @author Kaan Eray <kaan.eray@mni.thm.de>
 */


import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import {useState, useEffect} from "react";

import {useNavigation} from '@react-navigation/native';
//import {LinearGradient} from 'expo-linear-gradient';
import firebase from "firebase/compat";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import stylejs from "../style";

const SetItem = (props) => {
    const item_id = props.item_id;
    const category_id = props.category_id;
    const category_name = props.category_name;
    const categoryColor = props.categoryColor;
    const itemName = props.text;
    const item_description = props.description;
    const [questionCounter, setQuestionCounter] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        getQuestionCounter();
    }, [])

    /**
     * Gets the amount of Questions of the given Sets
     */
    const getQuestionCounter = () => {
        firebase.firestore()
            .collection('category')
            .doc(props.category_id)
            .collection("set")
            .doc(props.item_id)
            .collection('card')
            .onSnapshot(snapshot => {
                const arr = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().titel
                }))
                setQuestionCounter(arr.length);
            })
    }

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('CardDescription', {
                    category_id,
                    item_id,
                    category_name,
                    itemName,
                    item_description,
                    categoryColor,
                    questionCounter
                });
            }}
        >
            <View testID="SearchscreenQuestion" style={[stylejs.items_Container,{backgroundColor: categoryColor.left }]}>
            {/*<LinearGradient style={[stylejs.items_Container]} colors={[categoryColor.left, categoryColor.right]}>*/}
                <ImageBackground source={require('../asserts/intelligence.png')}
                                 imageStyle={{width: '45%', position: 'absolute', left: 100, opacity: 0.3}}
                                 style={{
                                     width: '100%',
                                     height: '100%',
                                     flexDirection: 'row',
                                     justifyContent: 'space-between',
                                 }}>
                    <View style={{flexDirection: "row", flex: 1}}>
                        <View style={{flex: 1}}>
                            <Text testID="SearchscreenQuestionTitle" style={stylejs.items_titleText}>{props.text}</Text>
                            <Text style={stylejs.items_amountText}>{questionCounter} Questions</Text>
                        </View>
                        <TouchableOpacity testID="SetItemNavToCardQueryBTN" onPress={() => {
                            navigation.navigate('CardQuery', {category_id: category_id, item_id, categoryColor});
                        }}>
                            <Icon name='play-circle-outline' size={50} color='white'/>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>
            {/* </LinearGradient>*/}
            </View>
        </TouchableOpacity>
    )
};

export default SetItem;
