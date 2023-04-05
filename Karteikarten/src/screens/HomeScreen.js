/**
 * @file HomeScreen of RefCard app
 * @author Fatih Yanar <fatih.yanar@mni.thm.de>
 */


import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image}
from 'react-native';
import {useEffect,useState} from "react";

import {SafeAreaView} from 'react-native-safe-area-context';

//import {LinearGradient} from "expo-linear-gradient";

import SetCategories from "../components/SetCategories";

import firebase from 'firebase/compat/app';

export default function HomeScreen({ }) {

    const [buttonFlag, setButtonFlag] = useState(true);
    const [myCategoriesArr, setMyCategoriesArr] = useState([]);


    useEffect(() => {
        getCategories();
    }, [])

    const setButtonFlag_func = () => {
        if (!buttonFlag) setButtonFlag(true)
    }

    const setButtonFlag_func2 = () => {
        if (buttonFlag) setButtonFlag(false)
    }

    /**
     * Get all Categories and save them into the Array to be displayed
     */
    const getCategories = () => {
        firebase.firestore()
            .collection('category')
            .onSnapshot(snapshot => {
            const arr = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().titel,
                categoryColor:doc.data().color
            }))
            setMyCategoriesArr(arr)
        })
    }


    /**
     * Toggles one of the two Buttons when Pressed
     * @param buttonFlag : Boolean
     * @returns Style of the Button
     */
    const btnStyle = function (buttonFlag) {
        if (buttonFlag) {
            return [styles.twoButtonFlagTrue]
        }
        return [styles.twoButtonFlagFalse]
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={{height:90,width:120,backgroundColor:'white'}}
                    source={require('../asserts/Logonew.png')}
                />
            </View>
            <View style={styles.lastOpenedTextContainer}>
                <Text style={styles.lastOpenedText} testID={"LastOpenedText"}>Last Opened</Text>
            </View>
            <TouchableOpacity  style={styles.lastOpenedItems}>
                <View style={styles.lastItem}>
                {/*<LinearGradient style={styles.lastItem} colors={['#2B32B2','#1488CC']}>*/}
                    <Text style={[styles.lastOpenedText,{color: 'white',paddingLeft:10,}]}>Diskrete Mathematik</Text>
                    <Text style={[styles.lastOpenedText,{color: 'white',paddingLeft:10,fontSize: 15,fontWeight: 'normal',opacity:0.8}]}>15 Questions</Text>
                {/*</LinearGradient>*/}
                </View>
            </TouchableOpacity>
            <View style={styles.buttons}>
                <TouchableOpacity testID={"MyCatBtn"} onPress={setButtonFlag_func}
                                  style={btnStyle(buttonFlag)}>
                    <Text testID={"MyCatText"} style={[styles.lastOpenedText,{color: buttonFlag ? '#F6F6F6': 'black',textAlign:'center'}]}>My Category</Text>
                </TouchableOpacity>
                <TouchableOpacity  testID={"AllCatBtn"} onPress={setButtonFlag_func2}
                                   style={btnStyle(!buttonFlag)}>
                    <Text testID={"AllCatText"} style={[styles.lastOpenedText,{color: buttonFlag ? 'black': '#F6F6F6',  textAlign:'center'}]}>All Category</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.catList}>
                <View style={styles.categoryItem}>
                    <FlatList
                        testID={"ItemsList"}
                        numColumns={1}
                        data={myCategoriesArr}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({item}) => <SetCategories name={item.name} id={item.id} categoryColor={item.categoryColor}/>}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent:'flex-start',
        backgroundColor:'white',
    },
    header:{
        backgroundColor:'white',
        flexDirection:'row',
        flex:1.9,
        alignItems:'center',
        paddingLeft:2,
        paddingRight:2,
        justifyContent:'center',
        marginTop:3
    },
    headerText:{
        fontSize:20,
        fontWeight:'bold',
        marginLeft:90
    },
    lastOpenedTextContainer: {
        backgroundColor:'white',
        flex:1,
        alignItems:'center',
        justifyContent:'flex-start',
        flexDirection:'row',
        paddingLeft:10
    },
    lastOpenedText: {
        fontSize:20,
        fontWeight:'bold',
        color:'black'
    },
    lastOpenedItems: {
        backgroundColor:'white',
        flexDirection:'row',
        flex:2,
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,
        width:'100%'
    },
    lastItem: {
        justifyContent:'center',
        width:'100%',
        height:'80%',
        backgroundColor:'blue',
        borderRadius:10,
    },
    buttons:{
        backgroundColor:'white',
        flexDirection:'row',
        flex:2,
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10
    },
    twoButtonFlagTrue: {
        justifyContent:'center',
        width:'46%',
        height:'60%',
        backgroundColor:'#FD4365',
        borderRadius:30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    twoButtonFlagFalse: {
        justifyContent:'center',
        width:'46%',
        height:'60%',
        backgroundColor:'#FBF9F9',
        borderRadius:30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    catList:{
        backgroundColor:'white',
        flexDirection:'column',
        flex:8,
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,
    },
    categoryItem :{
        backgroundColor:'white',
    }
});
