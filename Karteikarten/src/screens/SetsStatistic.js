/**
 * @file Return Set Statistic Overview 
 * @author Cuong Duc Nguyen cuong.duc.nguyen@mni.thm.de
 */

import * as React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import firebase from "firebase/compat";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from 'victory-native';

import SetSets from "../components/SetSets";
import {average} from "../utilities/Progress";
import { useNavigation } from '@react-navigation/native';

export default function SetsStatistic(props) {
    const categoryID = props.route.params.id
    const categoriesName = props.route.params.name
    const categoryColor = props.route.params.categoryColor;
    const [setArr, setSetArr] = useState([]);
    const [sampleData, setSampleData] = useState([]);
    const [barLabel, setBarLabel] = useState(0);
    const averageArr = [];
    const averageLabelArr = [];
    const setArrBuffer = [];
    const navigation = useNavigation();

    useEffect(() => {
        getSet();
    }, []);

    /**
    * Get the amount of Themes of each Category
    */
    const getSet = () => {
        const subscriber = firebase.firestore()
            .collection('category')
            .doc(categoryID)
            .collection('set')
            .onSnapshot(snapshot => {
                const arr = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().title
                }))
                for(var i = 0; i < arr.length; i++) {
                    getProgress(arr[i].id, arr[i].name, arr.length);
                }
                //setSetArr(arr);
            })
            return () => {subscriber()};
    }

    /**
     * Get the progress of set from a Category
     */
    const getProgress = (setID, setName, count) => {
        const subscriber = firebase.firestore()
            .collection('category')
            .doc(categoryID)
            .collection('set')
            .doc(setID)
            .collection('progress')
            .onSnapshot(snapshot => {
                const arr = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    right: doc.data().right,
                    wrong: doc.data().wrong
                }))
                
                // If a set doesm't have a progress, don't display it in the diagram
                if(arr.length == 0) {
                    averageArr.push({x: ' ', y: 0});
                    averageLabelArr.push('');                    
                } else {
                    const buffer = [arr.length];
                    for(var i = 0; i < arr.length; i++) {
                        buffer[i]= (arr[i].right/(arr[i].right + arr[i].wrong) * 100);
                    }                
                    // Average Grade of the set (theme)
                    const value = Math.round(average(buffer));
                    averageArr.push({x: setName, y: value});
                    averageLabelArr.push(`${value}%`);
                    setArrBuffer.push({id: setID, name: setName});
                }                
                if(count == averageArr.length) {
                    setSampleData(averageArr);
                    setBarLabel(averageLabelArr);
                    setSetArr(setArrBuffer);
                }
            })
       return () => {subscriber()};
    }

    /**
    * Create Header of the Screen
    * @param
    * @returns {View Component}
    */
    const Header = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={{width: '20%'}}
                >
                    <Icon name='chevron-back-sharp' size={50} color= '#FD4365'/>
                </TouchableOpacity>
                <View style={{width: '80%', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, paddingRight: '25%'}}>
                        Set Overview
                    </Text>
                </View>
            </View>
        );
    };

    /**
    * Create a diagram (bar) of the Screen
    * @param props
    * @returns {View Component with VictoryChart}
    */
    const Chart = (props) => {
        if(props.sampleData.length > 0 && props.barLabel.length > 0) {
            return (
                <View style={styles.diagrammContainer}>
                    <Text style={{paddingRight: '6%'}}>Average Grade</Text>
                    <VictoryChart
                        theme={VictoryTheme.bar}
                        domainPadding={{ x: 300 }}
                        domain={{ y: [0, 100]}}
                    >
                        <VictoryBar
                            data={props.sampleData}
                            style={{
                                data: { fill: categoryColor.left },
                                labels: { fill: categoryColor.left },
                            }}
                            labels={props.barLabel}
                        />
                        {/* Show x-axis */}
                        <VictoryAxis/>
                        {/* Show y-axis */}
                        <VictoryAxis dependentAxis
                            label="percentage"
                            style={{
                                axisLabel: { padding: 40 }
                            }}
                        />
                    </VictoryChart>
                </View>
            );
        }
        return (
            <View></View>
        );
    }

     /**
     * Displays a loading Screen when get data from firebase
     */
      if (sampleData.length == 0) {                
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color='#00ff00'/>
            </View>

            /*<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>empty</Text>
            </View>
            */
        );
    }

    return (
        <View style={styles.container}>
            <Header/>
            <Chart sampleData={sampleData} barLabel={barLabel}/>
            <Text>Go to learning progress</Text>
            <View style={styles.setsContainer}>
                <FlatList
                    numColumns={1}
                    data={setArr}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <SetSets name={item.name} id={item.id} categoryID={categoryID} categoryColor={categoryColor}/>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5fcff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '15%',
        justifyContent: 'center',
        alignItems: "center",
        paddingTop: '10%'
    },
    diagrammContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '5%'
    },
    setsContainer: {
        width: '100%',
        height: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft:10,
        paddingRight:10,
    },
});
