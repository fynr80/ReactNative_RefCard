/**
 * @file CardQuery for RefCards
 * @author Cuong Duc Nguyen <cuong.duc.nguyen@mni.thm.de>
 */


import React, {useState, useEffect, useRef} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Button} from 'react-native-paper'
import FlipCard from 'react-native-flip-card';
import {useNavigation} from '@react-navigation/native';
import firebase from "firebase/compat";
import CardStack, {Card} from 'react-native-card-stack-swiper';
import {SafeAreaView} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
//import {LinearGradient} from "expo-linear-gradient";
import Moment from 'moment';

import stylejs from "../style";

/**
 * @brief Create a header with StatusBar and MaterialIcons Component.
 * @param {*} props
 * @returns JSX.Element
 */
function Header(props) {
    const navigation = props.navigation;

    return (
        <View style={[stylejs.headerNew, {flexDirection: 'row', width: "100%", alignItems: "flex-start", justifyContent: "center", paddingTop: props.paddingTopValue}]}>
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Icon name='chevron-back-sharp' size={50} color='#FD4365'/>
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[stylejs.headerText, {marginTop: 14, paddingRight: '15%'}]}>CARD QUIZ</Text>
            </View>
        </View>
    );
}

/**
 * Copy the contents in a temporary Array
 * @param arr : any[]
 * @returns {*[]}
 * @note This function was created temporarily to work around the bug
 */
function copyArr(arr) {
    const data = [];
    let i;
    for (i = 0; i < arr.length; i++) {
        data[i] = i;
    }
    return data;
}

export default function CardQuery(props) {
    const category_id = props.route.params.category_id;
    const category_color = props.route.params.categoryColor;
    const item_id = props.route.params.item_id;
    const [isEmpty, setIsEmpty] = useState(false);
    const [data, setData] = useState([]);
    const navigation = useNavigation();
    const arr = copyArr(data);
    const cardSwipe = useRef();
    const [isSwipe, setSwipe] = useState(false);
    const [countRightAnswer, setCountRightAnswer] = useState(0);
    const [countWrongAnswer, setCountWrongAnswer] = useState(0);
    const [count, setCount] = useState(0);
    const [noMoreCard, setNoMoreCard] = useState(false);
    const [arrRight, setArrRight] = useState([]);
    const [arrWrong, setArrWrong] = useState([]);
    const formatDate = Moment().format('YYYY-MM-DD');  //hh:mm:ss a');
    const date = new Date();
    const time = `${(date.getHours()+2)}.${date.getMinutes()}.${date.getSeconds()}`;
    // getTime() returns the number of milliseconds since January 1, 1970
    const numberOfMilliseconds = date.getTime();
    const [arrBoxNumberR, setArrBoxNumberR] = useState([]);
    const [arrBoxNumberW, setArrBoxNumberW] = useState([]);
    const [arrIndexR, setArrIndexR] = useState([]);
    const [arrIndexW, setArrIndexW] = useState([]);

    /**
     * Retrieve all the questions and store them in the array of questions used for the query
     */
    useEffect(() => {
            firebase
            .firestore()
            .collection('category')
            .doc(category_id)
            .collection('set')
            .doc(item_id)
            .collection('card')
            .get().then(res => {
                const arr = res.docs.map((doc) => ({
                    id: doc.id,
                    question: doc.data().question,
                    answer: doc.data().answer,
                    date: doc.data().date,
                    box: doc.data().box,
                }))
                if(arr.length > 0) {
                    setData(spacedRepetition(arr));
                }
            });
    }, []);

    /**
    * @description Adds the progess from the set
    * @returns {Promise<void>}
    */
    const createProgress = async () => {
        await firebase.firestore()
            .collection('category')
            .doc(category_id)
            .collection("set")
            .doc(item_id)
            .collection("progress")
            .add({
                right: countRightAnswer,
                wrong: countWrongAnswer,
                date: formatDate,
                time: time,
                numberOfMilliseconds: numberOfMilliseconds,
                dataRight: arrRight,
                dataWrong: arrWrong,
            });
    }

    const Next = (props) => {
        if(props.noMoreCard) {
            return (
                <Button
                    style={[stylejs.defaultButton, {marginBottom: '5%'}]}
                    onPress={() => {
                        props.createProgress();
                            if(countRightAnswer > 0) {
                                for(var i = 0; i < arrBoxNumberR.length; i++) {
                                    updateSpaceRepetitionBox(arrBoxNumberR[i], arrIndexR[i]);
                                }
                            }
                            if(countWrongAnswer > 0) {
                                for(var j = 0; j < arrBoxNumberW.length; j++) {
                                    updateSpaceRepetitionBox(arrBoxNumberW[j], arrIndexW[j]);
                                }
                            }
                            props.navigation.navigate('ProgressCardQuery', {category_id: category_id, item_id});
                       }
                    }
                >
                    <Text style={[stylejs.modal_text, {color: "white"}]}>NEXT</Text>
                </Button>
            );
        }

        return <View></View>
    };

    /**
     * Method which questions are asked according to the Spaced Repetition method
     * @param arr : any[]
     * @returns {*}
     */
    function spacedRepetition(arr) {
        let currentDate = new Date();
        return arr.filter(function (element) {
            if (element.box === 1) {
                return true;
            } else if (element.box === 2) {
                let firestoreDate = new Date(element.date.toDate())
                let sub = (currentDate - firestoreDate) / 1000 / 60 / 60;
                if (sub > 24) {
                    return true;
                }
            } else if (element.box === 3) {
                let firestoreDate = new Date(element.date.toDate())
                let sub = (currentDate - firestoreDate) / 1000 / 60 / 60;
                if (sub > 168) {
                    return true;
                }
            } else if (element.box === 4) {
                let firestoreDate = new Date(element.date.toDate())
                let sub = (currentDate - firestoreDate) / 1000 / 60 / 60;
                if (sub > 336) {
                    return true;
                }
            } else if (element.box === 5) {
            }
        });
    }

    /**
     * Updates the box number of the current question
     * @param boxNumber : Number
     */
    function updateSpaceRepetitionBox(boxNumber, index) {
        firebase.firestore()
            .collection('category')
            .doc(category_id)
            .collection('set')
            .doc(item_id)
            .collection('card')
            .doc(data[index].id)
            .update({
                box: boxNumber,
                date: new Date()
            }).then(() => {
            console.log("Document successfully written!");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        })
    }


    setTimeout(() => {
        setIsEmpty(true);
    }, 5000);

     /**
     * Displays a loading Screen when get data from firebase
     */
      if (data.length == 0) {
        if(isEmpty) {
            return (
                <View style={{flex: 1}}>
                    <Header navigation={navigation} paddingTopValue={'5%'}/>
                    <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{paddingBottom: '20%'}}>empty</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size='large' color='#00ff00'/>
                </View>
            );
        }
    }


    /**
     * Performs the update of the Box-number when swiped
     * @param text : String
     * @private
     */
    function __swipe(text) {
        const boxNum = data[count].box;

        if (text === 'Swipe Left') {
            let boxNumber
            if (boxNum === 1) {
                boxNumber = boxNum
            } else {
                boxNumber = 1
            }
            setArrWrong([...arrWrong, data[count]]);
             //Variable for the function updateSpaceRepetitionBox(boxNumber, index);
            setArrBoxNumberW([...arrBoxNumberW, boxNumber]);
            setArrIndexW([...arrIndexW, count]);
            setCountWrongAnswer(countWrongAnswer + 1);
        } else {
            let boxNumber
            if (boxNum === 5) {
                boxNumber = boxNum;
            } else {
                boxNumber = boxNum + 1;
            }
            setArrRight([...arrRight, data[count]]);
            //Variable for the function updateSpaceRepetitionBox(boxNumber, index);
            setArrBoxNumberR([...arrBoxNumberR, boxNumber]);
            setArrIndexR([...arrIndexR, count]);
            setCountRightAnswer(countRightAnswer + 1);
        }

        if ((count + 1) < data.length) {
            setCount(count + 1);
        } else {
            setNoMoreCard(true);6
        }
        setSwipe(false);
        console.log(text);
    }

    const UnderHeader = () => {
        if(data.length == 0) {
            return (
                <Text testID="CardQueryTextIndexCounter" style={{fontSize: 28, fontWeight: '900'}}>
                    {"Index Card " + count + " from " + (data.length)}
                </Text>
            );
        }
        return (
            <Text style={{fontSize: 28, fontWeight: '900'}}>
                Index Card {count + 1} from {data.length}
            </Text>
        );
    };


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <Header navigation={navigation} paddingTopValue={'0%'}/>
            <View style = {styles.underHeader}>
                <UnderHeader/>
            </View>
            <View style={styles.bodyContainer}>
                {/*Title*/}
                {/*Index Cards*/}
                {/*Swipe-animation*/}
                <CardStack
                    style={styles.cardContainer}
                    ref={cardSwipe}
                    onSwipedLeft={() => {
                        __swipe('Swipe Left');
                    }}
                    onSwipedRight={() => {
                        __swipe('Swipe Right');
                    }}
                    verticalSwipe={false}
                    horizontalSwipe={isSwipe}
                >
                    {/*create many cards*/}
                    {arr.map((arr, index) => {
                        return (
                            <Card key={arr}>
                                {/*Flip animation*/}
                                <FlipCard
                                    style={{width: 380, height: 280}}
                                    onFlipStart={() => {
                                        setSwipe(true)
                                    }}
                                >
                                    {/*Face Side*/}
                                    <View testID="CardQueryFrontSide" style={[styles.card, {backgroundColor: category_color.left,}]}>
                                        {/*<LinearGradientcolors={[category_color.left, category_color.right]}style={styles.card}>*/}
                                        <Text testID="QCardQueryFrontSide" style={{
                                            color: 'white',
                                            fontSize: 24,
                                            fontWeight: "bold"
                                        }}> {data[index].question} </Text>
                                        {/* </LinearGradient>*/}
                                    </View>
                                    {/*Back Side*/}
                                    <View testID="CardQueryBackSide" style={[styles.card, {backgroundColor: category_color.left,}]}>
                                        {/* <LinearGradient colors={[category_color.right, category_color.left]} style={styles.card}>*/}
                                        <Text testID="ACardQueryFrontSide" style={{
                                            color: 'white',
                                            fontSize: 24,
                                            fontWeight: "bold"
                                        }}>{data[index].answer}</Text>
                                        {/* </LinearGradient>*/}
                                    </View>
                                </FlipCard>
                            </Card>
                        );
                    })}
                </CardStack>
                <Next noMoreCard={noMoreCard} navigation={navigation} createProgress={createProgress}/>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bodyContainer: {
        flex: 4,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    cardContainer: {
        backgroundColor: 'white',
        width: '90%',
        height: '70%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 380,
        height: 280,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    underHeader: {
        flex: 1,
        alignItems: 'center',
    },
});
