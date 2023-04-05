/**
 * @file StatisticScreen of RefCard app
 * @author Fatih Yanar <fatih.yanar@mni.thm.de>
 * @author Cuong Duc Nguyen <cuong.duc.nguyen@mni.thm.de>
 */

import * as React from 'react';
import {
    ActivityIndicator,
    FlatList,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import firebase from "firebase/compat";
import {useEffect,useState} from "react";
import { VictoryLabel ,VictoryPie } from "victory-native";
import { SafeAreaView} from 'react-native-safe-area-context';

import SetCategoriesStatistic from "../components/SetCategoriesStatistic";

export default function StatisticScreen() {
    const [myCategoriesArr, setMyCategoriesArr] = useState([]);
    // This variable is needed because of the bug
    // Problem: If this function is not used, VictoryPie will not be showed
    // avoid bug by using this function even if the variable myCardArr is not used
    const [myCardsArr, setMyCardsArr] = useState([]);
    const bufferCategorieArr = [];
    const colorArr = [];
    const cardsArr = [];
    const [isEmpty, setIsEmpty] = useState(false);
    const [sampleData, setSampleData] = useState([]);
    const [sampleColor, setSampleColor] = useState([]);
    const lastCategory = [0];
    //trigger for deleteArr() and getCards()
    const y = [1];
    // Is used for updating Statistic by add or delete cards
    const buffer = [];

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        const unsubscriber = firebase.firestore()
            .collection('category')
            .onSnapshot(snapshot => {
                const arr = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().titel,
                    categoryColor: doc.data().color
                }))
                // new Category will also be set in bufferCategorieArr
                if(arr.length >= bufferCategorieArr.length) {
                    for(var i = 0; i < arr.length; i++) {                        
                        if(i == arr.length-1) {
                            lastCategory[0] = arr.length;
                            getSets(arr[i].id, arr[i].name, arr[i].categoryColor, arr, arr.length);
                        } else {
                            getSets(arr[i].id, arr[i].name, arr[i].categoryColor, arr, 0);
                        }
                    }
                } else { // delete category from bufferCategorieArr                    
                    deleteArr(arr);
                }
            })
        return () => {unsubscriber()};
    };

    const getSets = (categoryID, categoryName, categoryColor, categoryArr, count) => {
        let subscriber;
        subscriber = firebase.firestore()
            .collection('category')
            .doc(categoryID)
            .collection('set')
            .onSnapshot(snapshot => {
                const arr = snapshot.docs.map((doc) => ({
                    id: doc.id,
                }))                    
                    for(var i = 0; i < arr.length; i++) {
                        getCards(categoryID, categoryName, arr[i].id, categoryColor, categoryArr, count);
                    }
            })
            return () => {subscriber()};
    };

    const getCards = (categoryID, categoryName, setID, categoryColor, categoryArr, count) => {
        const subscriber = firebase.firestore()
            .collection('category')
            .doc(categoryID)
            .collection('set')
            .doc(setID)
            .collection('card')
            .onSnapshot(querySnapshot => {
                const cardList = [];
                querySnapshot.forEach(docSnapshot => {
                    cardList.push({
                        ...docSnapshot.data(),
                        id: docSnapshot.id,
                    })
                })
                // Only category that contains cards will be set
                // y is a trigger for deleting catecory                
                if(cardList.length > 0 && y[0] == 1) {                    
                    // One category per Slice of VictoryPie can be showed
                    // New category will be pushed
                    if(!cardsArr.some(data => data.x == categoryName)) {                        
                        buffer.push({categoryName: categoryName, setID: setID, countCards: cardList.length});
                        colorArr.push(categoryColor.left);
                        cardsArr.push({x: categoryName, y: cardList.length});
                        bufferCategorieArr.push({id: categoryID, name: categoryName, setID: setID, categoryColor: categoryColor, countCards: cardList.length});

                        // Problem: If this function is not used, VictoryPie will not be showed
                        // avoid bug by using this function even if the variable myCardArr is not used
                        setMyCardsArr(cardList);

                        // avoid repitition
                        // Set data if the last category is reach
                        if(lastCategory[0] == categoryArr.length) {                            
                            setSampleData(cardsArr);
                            setSampleColor(colorArr);
                            setMyCategoriesArr(bufferCategorieArr);
                        }
                    } else { // If a category allready exist, then change only the y Value of cardsArr.                        
                        const indexSet = buffer.findIndex(e => e.setID == setID);
                        if(indexSet < 0) {
                            // Set aus der selben Kategorie die nicht in buffer enthält soll gepusht werden.
                            buffer.push({categoryName: categoryName, setID: setID, countCards: cardList.length});
                        } else {
                            // anderenfalls soll nur der Wert geändert werden.
                            // ausgeöst wird dieser nur, wenn die Kartenanzahl einer Set geändert wird.
                            buffer[indexSet].countCards = cardList.length;
                        }

                        // Hier werden alle Karten zusammengefasst, die in der selben Kategorie gehören.
                        const buffer_2 = buffer.filter(e => e.categoryName == categoryName);
                        var sum = 0;
                        for(var i = 0; i < buffer_2.length; i++) {
                            sum = sum + buffer_2[i].countCards;
                        }

                        // Index zu der bestimmten Kategorie wird gesucht.
                        const indexCategory = bufferCategorieArr.findIndex(e => e.name == categoryName);
                        const indexCard = cardsArr.findIndex(e => e.x == categoryName);                        
                        if(indexCategory > -1) {
                            // Falls index gefunden wurde, soll der neue Gesamtwert zugewiesen werden.
                            bufferCategorieArr[indexCategory].countCards = sum;
                            cardsArr[indexCard].y = sum;
                        }

                        // Problem: There is still one card left, if all cards from a set is deleted
                        // avoid bug: Second check if the data is really emtpy
                        if(cardList.length == 1) {
                            secondCheck(categoryID, categoryName, setID, indexCategory, indexSet, indexCard);
                        } else {
                            // Problem: If this function is not used, VictoryPie will not be showed
                            // avoid bug by using this function even if the variable myCardArr is not used
                            setMyCardsArr(cardList);
                            // avoid repitition
                            // Set data if the last category is reach
                            if(lastCategory[0] == categoryArr.length) {                                
                                setSampleData(cardsArr);
                                setSampleColor(colorArr);
                                setMyCategoriesArr(bufferCategorieArr);
                            }
                        }
                    }
                } else {
                    // Index zu der bestimmten Kategorie wird gesucht.
                    const indexCategory = bufferCategorieArr.findIndex(e => e.name == categoryName);
                    const indexSet = buffer.findIndex(e => e.setID == setID);
                    const indexCard = cardsArr.findIndex(e => e.x == categoryName);                        
                    secondCheck(categoryID, categoryName, setID, indexCategory, indexSet, indexCard);
                    // y is a trigger for deleting catecory
                    y[0] = 1;                    
                }
            });
        return () => {subscriber()};
    };

    /**
    * Second Check if the data is really empty
    * @param
    * @returns {*}
    */
    const secondCheck = (categoryID, categoryName, setID, indexCategory, indexSet, indexCard) => {
        const subscriber = firebase.firestore()
            .collection('category')
            .doc(categoryID)
            .collection('set')
            .doc(setID)
            .collection('card')
            .onSnapshot(snapshot => {
                const cardList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                }))

                if(cardList.length == 0) {

                    // Ein Set wird aus der buffer-Liste entfernt.
                    const index = buffer.findIndex(e => e.setID == setID);
                    if(index > -1) {                        
                        buffer.splice(index, 1);
                    }
                    // Die restlichen Karten von Sets aus der selben Kategorie werden zusammengefasst und neu zugewiesen.
                    const buffer_3 = buffer.filter(e => e.categoryName == categoryName);
                    // Nur wenn es noch Sets gibt, die aus der selben Kategorie stammen.
                    if(buffer_3.length > 0) {
                        var sum = 0;
                        for(var i = 0; i < buffer_3.length; i++) {
                            sum = sum + buffer_3[i].countCards;
                        }
                        if(indexCategory > -1) {
                            bufferCategorieArr[indexCategory].countCards = sum;
                            cardsArr[indexCard].y = sum;
                        }
                    } else {
                        if(indexCategory > -1) {
                            // Falls es kein Set mehr gibt, werde alle abhängige Daten geloescht
                            bufferCategorieArr.splice(indexCategory, 1);
                            cardsArr.splice(indexCard, 1);
                            colorArr.splice(indexCard, 1);
                        }
                    }
                }
                // Problem: If this function is not used, VictoryPie will not be showed
                // avoid bug by using this function even if the variable myCardArr is not used
                setMyCardsArr(cardList);
                setSampleData(cardsArr);
                setSampleColor(colorArr);
                setMyCategoriesArr(bufferCategorieArr);
            });
            return () => {subscriber()};
    }

    /**
    * Delete all items from a category and also all buffers (bufferCategorieArr, cardsArr, colorArr)
    * @param arr : contains current catatories
    * @returns {*}
    */
    const deleteArr = (arr) => {
        var index = 0;
        //var foundID = '';
        var foundCategoryName = '';
        for(var i = 0; i < bufferCategorieArr.length; i++) {
            for(var j = 0; j < arr.length; j++) {
                // Find category that is not contains in arr from shnapshot because is deleted
                if(bufferCategorieArr[i].id == arr[j].id) {
                    index = -1;
                    break;
                } else {
                    index = i;
                    //foundID = i;
                    foundCategoryName = bufferCategorieArr[i].categoryName;
                }                
            }
            if(index > -1) {                
                bufferCategorieArr.splice(index, 1);
                cardsArr.splice(index, 1);
                colorArr.splice(index, 1);
                lastCategory[0] = lastCategory[0] - 1;
                //trigger for deleteArr() and getCards()
                y[0] = 0;
            }
        }
        for(let i = 0; i < buffer.length; i++) {            
            if(foundCategoryName == buffer[i].categoryName) {                
                buffer.splice(i, 1);
            }
        }        
    };

    /**
    * Create Header of the Screen
    * @param
    * @returns {View Component}
    */
    const Header = () => {
        return (
            <View style={styles.headerContainer}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Categorie Overview</Text>
            </View>
        );
    };

    /**
    * Create StatisticPie of the Screen
    * @param props
    * @returns {View Component with VictoryPie or just View Component}
    */
    const StatisticPie = (props) => {
        if(props.dataLenght > 0) {        
            return (
                <View style={styles.pieContainer}>
                    <VictoryPie
                        style={{
                            data: {
                              stroke: "#fff", strokeWidth: 1
                            },
                            labels: {
                                fill: 'white',                                
                            },                            
                        }}
                        data={sampleData}
                        colorScale={sampleColor}
                        labelRadius={({ innerRadius }) => props.dataLenght == 1 ? innerRadius + 1 : innerRadius + 30 }
                        labelPosition={"centroid"}
                        labelPlacement={() => props.dataLenght == 1 ? 'vertical' : 'parallel'}  
                    />
                </View>
            );
        }

        return <View></View>
    };

    setTimeout(() => {            
        setIsEmpty(true);                                         
    }, 5000);

     /**
     * Displays a loading Screen when get data from firebase
     */
      if (myCategoriesArr.length == 0) {                        
        if(isEmpty) {                                    
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>                    
                    <Text>empty</Text>
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

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#f5fcff"}}>
            <Header/>
            <StatisticPie dataLenght={myCategoriesArr.length}/>
            <View style={styles.categoryContainer}>
                <FlatList
                    numColumns={1}
                    data={myCategoriesArr}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item}) => <SetCategoriesStatistic name={item.name} id={item.id} setID={item.setID} categoryColor={item.categoryColor} countCards={item.countCards}/>}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    pieContainer: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryContainer: {
        flexDirection:'column',
        flex:3,
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,
    },
  });
