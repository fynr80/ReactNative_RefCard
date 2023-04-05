/**
 * @file Get and Return Categories & Style for HomeScreen
 * @author Fatih Yanar fatih_yanar@gmx.de
 */

import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground
} from "react-native";
import {useEffect, useState} from "react";

//import {LinearGradient} from 'expo-linear-gradient';
import firebase from "firebase/compat";
import {useNavigation} from '@react-navigation/native';
import IconF from 'react-native-vector-icons/FontAwesome'

import stylejs from "../style";


const SetCategories = (props) => {
    const id = props.id
    const categoriesName = props.name
    const categoryColor = props.categoryColor;
    const navigation = useNavigation();
    const [themeCounter, setThemeCounter] = useState(0);


    useEffect(() => {
        return getThemeCounter()
    })

    /**
     * Get the amount of Themes of each Category
     */
    const getThemeCounter = () => {
        firebase.firestore()
            .collection('category')
            .doc(props.id)
            .collection("set")
            .onSnapshot(snapshot => {
                const arr = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().titel
                }))
                setThemeCounter(arr.length)
            })
    }

    /**
     * Got the SearchScreen of the selected Category
     */
    const goToSearch = () => {
        navigation.navigate("Search", {id, categoriesName, categoryColor})
    }

    return (
        <TouchableOpacity
            onPress={goToSearch}
        >
            <View testID="homescreenSet" style={[stylejs.items_Container,{height:120, backgroundColor: categoryColor.left}]}>
            {/* <LinearGradient style={[stylejs.items_Container,{height:120}]} colors={[categoryColor.left,categoryColor.right]}>*/}
                <ImageBackground  source={require('../asserts/intelligence.png')} imageStyle={{width:'30%',position:'absolute',left:100,opacity:0.3}} style={{width: '100%', height: '100%',flexDirection:'row',justifyContent:'space-between'}}>
                    <View >
                        <Text testID={"homescreenSetTitle"} numberOfLines={2} style={stylejs.items_titleText}>{props.name}</Text>
                        <Text style={stylejs.items_amountText}>{themeCounter} Sets</Text>
                    </View>
                    <View>
                        <IconF name='chevron-right' size={35} color='white'/>
                    </View>
                </ImageBackground>
            {/*  </LinearGradient>*/}
            </View>
        </TouchableOpacity>
    )
};

export default SetCategories;
