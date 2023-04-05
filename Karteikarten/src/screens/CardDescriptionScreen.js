/**
 * @file CardDescriptionScreen for RefCard
 * @author Ibrahim Eraslan <ibrahim.eraslan@mni.thm.de>
 */


import * as React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import {SafeAreaView} from 'react-native-safe-area-context';
//import {LinearGradient} from "expo-linear-gradient";
import {useNavigation} from "@react-navigation/native";

import stylejs from "../style";
import SetDropDown from "../components/SetDropDown";


export default function CardDescriptionScreen(props) {
    const itemName = props.route.params.itemName;
    const item_description = props.route.params.item_description;
    const categoryId = props.route.params.category_id;
    const item_id = props.route.params.item_id;
    const categoryColor = props.route.params.categoryColor;
    const questionCounter = props.route.params.questionCounter

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    testID="CardDescriptionbackbutton"
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Icon name='chevron-back-sharp' size={50} color='#FD4365'/>
                </TouchableOpacity>

                <Text testID="cardDescriptionHeadline" style={styles.headerText}>DESCRIPTION</Text>
                <SetDropDown style={stylejs.items_dropdown}
                             title={props.text}
                             item_id={item_id}
                             categorieID={categoryId}/>
            </View>
            <View style={styles.topMain}>
                <View testID="a" style={[styles.cardDescription, {backgroundColor: categoryColor.left}]}>
                    {/*<LinearGradient colors={[categoryColor.left, categoryColor.right]} style ={styles.cardDescription}>*/}
                    <View>
                        <Text
                            testID="cardDescriptionItemName"
                            style={{
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 20
                        }}>{itemName}</Text>
                        <Text testID="cardDescriptionItemDescription" style={{color: 'white', textAlign: 'left', marginTop: 5}}>{item_description}</Text>
                    </View>
                    <View style={styles.underTopDescription}>
                        <View>
                            <Text testID="cardDescriptionQuestionCounter" style={{color: 'white', textAlign: 'center', marginTop: 5}}>{questionCounter}</Text>
                            <Text style={{color: 'white', textAlign: 'left'}}>Questions</Text>
                        </View>
                        <View>
                            <Text testID="cardDescriptionQuestionCounter" style={{color: 'white', textAlign: 'center', marginTop: 5}}>{questionCounter}</Text>
                            <Text style={{color: 'white', textAlign: 'left'}}>Questions</Text>
                        </View>
                    </View>
                    {/*</LinearGradient>*/}
                </View>
            </View>
            <View style={styles.underMain}>
                <TouchableOpacity activeOpacity={.8}
                                  style={styles.topUnderMain}
                                  testID="Learn-mode"
                                  onPress={() => {
                                      navigation.navigate('CardQuery', {
                                          category_id: categoryId,
                                          item_id,
                                          categoryColor
                                      });
                                  }}>
                    <View style={styles.button}>
                        <View style={styles.buttonText}>
                            <Text style={{
                                color: 'black',
                                textAlign: 'left',
                                fontWeight: 'bold',
                                fontSize: 20
                            }}>Learn-mode</Text>
                            <Text style={{color: 'black', textAlign: 'left', fontSize: 15}}>Learning according to Spaced
                                Repetition</Text>
                        </View>
                        <View>
                            <Icon name='play' size={40} color='black'/>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {        
        flex: 1,
        justifyContent: 'center',
        alignContent: 'flex-start',

    },
    header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 2,
        paddingRight: 2,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    cardDescription: {
        backgroundColor: '#FE357D',
        width: '90%',
        height: '90%',
        borderRadius: 26,
        padding: 10,
        justifyContent: 'space-between',
        paddingBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    underTopDescription: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30,
    },
    topMain: {
        backgroundColor: 'white',
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    underMain: {
        backgroundColor: 'white',
        flex: 5,
        justifyContent: 'center'
    },
    topUnderMain: {
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        backgroundColor: '#FBF9F9',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 18,
        padding: 10,
        height: 90,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
});

