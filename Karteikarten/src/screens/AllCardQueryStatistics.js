/**
 * @file Show the history of all Statistics from CardQuery
 * @author Cuong Duc Nguyen cuong.duc.nguyen@mni.thm.de
 */

import * as React from 'react';
import {
    ActivityIndicator,
    View,
    Text,     
    TouchableOpacity,   
    StyleSheet,
} from "react-native";
import { useEffect, useRef, useState } from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import firebase from "firebase/compat";
import Carousel from 'react-native-snap-carousel';
import * as Progress from 'react-native-progress';
import {useNavigation} from '@react-navigation/native';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter } from 'victory-native';

/**
    * navigate to RightWrongHistory.js
    * @param 
    * @returns {*}
    */
function goToRightAnswerHistory(navigation, setName, dataRight, dataWrong, cardColor) {            
    navigation.navigate('RightWrongHistory', {setName, dataRight, dataWrong, cardColor});
};

export default function AllCardQueryStatistics (props) {
    const categoryID = props.route.params.categoryID;
    const setID = props.route.params.setID;
    const setName = props.route.params.setName;    
    const cardRef = useRef(); 
    const navigation = useNavigation();    
    
    const [isEmpty, setIsEmpty] = useState(false);
    const [progressArr, setProgressArr] = useState([]);
    const [sampleData, setSampleData] = useState([]);
    // Is used for the symbol circle (color: red, black) in the diagram
    const [yAxis, setYAxis] = useState();

    useEffect(() => {
        return getProgress()
    }, [])

    /**
     * Get the progress of set from a Category
     */
    const getProgress = () => {        
        const subscriber = firebase.firestore()
            .collection('category')
            .doc(categoryID)
            .collection('set')
            .doc(setID)
            .collection('progress')
            .onSnapshot(snapshot => {
                const arr = snapshot.docs.map((doc) => ({
                    id: doc.id,       
                    dataRight: doc.data().dataRight,
                    dataWrong: doc.data().dataWrong,             
                    date: doc.data().date,
                    time: doc.data().time,
                    numberOfMilliseconds: doc.data().numberOfMilliseconds,
                    rightAnswer: doc.data().right,
                    wrongAnswer: doc.data().wrong
                }))       
                if(arr.length > 0) {
                    const sortDateArr = arr.sort((a, b) =>  a.numberOfMilliseconds - b.numberOfMilliseconds);                
                    const buffer = [sortDateArr.length];                                
                    var value_y = 0;
                    var value = 0;
                    for(var i = 0; i < sortDateArr.length; i++) {
                        value_y = Math.round((sortDateArr[i].rightAnswer / (sortDateArr[i].rightAnswer + sortDateArr[i].wrongAnswer)) * 100);
                        buffer[i] = {x: `${i+1}`, y: value_y};
                        if(i == 0) {
                            value = `${i+1}`;
                        }
                    }
                    setProgressArr(sortDateArr);  
                    setSampleData(buffer);
                    setYAxis(value);
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
                        Learning Progress
                    </Text>
                </View>                                    
            </View>
        );
    }

    /**
    * Create diagram (line) of the Screen
    * @param 
    * @returns {View Component with VictoryChart}
    */
    const Diagramm = (props) => {        
        return (
            <View style={styles.diagrammContainer}>
                <Text style={{paddingRight: '5%'}}>{props.setName}</Text>
                <VictoryChart
                    domain={{y: [0, 100]}}       
                    padding={{ top: 20, bottom: 60, left: 60, right: 30 }}             
                >                    
                    <VictoryLine data={props.sampleData}/>
                    {/* Show x-axis */}
                    <VictoryAxis label="Session"/>
                    {/* Show y-axis */}
                    <VictoryAxis dependentAxis
                        label="percentage"
                        style={{
                            axisLabel: { padding: 40 }
                        }}
                    />
                    {/* Displays circle in the diagram */}
                    <VictoryScatter
                        style={{
                            data: {
                              fill: ({datum}) => datum.x == yAxis ? '#c43a31' : 'black'
                            }
                        }}
                        data={props.sampleData}
                        size={4}
                        symbol={'circle'}
                    />
                </VictoryChart>
            </View>
        );
    }

    /**
    * render card swipe
    * @param item: data from progressArr
    * * @param index: index of progressArr
    * @returns {View Component}
    */
    const _renderItem = ({item, index}) => {        
        return (
            <View style={styles.slide}>            
                <Text>{item.date},  {item.time}</Text>
                {/*right answer bar*/}
                <TouchableOpacity 
                    style={styles.progressBarContainer}
                    onPress={() => goToRightAnswerHistory(navigation, setName, item.dataRight, [], '#66e000')}                    
                >
                    <Text>Knew: {item.rightAnswer}</Text>
                    <Progress.Bar 
                        progress={item.rightAnswer/(item.rightAnswer + item.wrongAnswer)} 
                        width={300}
                        color={'#66e000'}
                    />
                </TouchableOpacity>
                {/*wrong answer bar*/}
                <TouchableOpacity 
                    style={styles.progressBarContainer}
                    onPress={() => goToRightAnswerHistory(navigation, setName, [], item.dataWrong, '#dc4a46')}
                >
                    <Text>Forget: {item.wrongAnswer}</Text>            
                    <Progress.Bar 
                        progress={item.wrongAnswer/(item.rightAnswer + item.wrongAnswer)} 
                        width={300}
                        color={'#dc4a46'}
                    />
                </TouchableOpacity>                
            </View>
        );
    }
    
    setTimeout(() => {            
        setIsEmpty(true);                                         
    }, 5000);

     /**
     * Displays a loading Screen when get data from firebase
     */
      if (sampleData.length == 0) {                        
        if(isEmpty) {                                    
            return (
                <View style={{flex: 1}}>
                    <Header/>
                    <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>                    
                        <Text style={{paddingBottom: '20%'}}>empty</Text>
                    </View>
                </View>                
            );
        } else {            
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large' color='#00ff00'/>
                </View>                    
            );
        }                              
    }

    return (
        <View style={styles.container}>
            <Header/>
            <Diagramm setName={setName} sampleData={sampleData}/>
            <View style={styles.historyContainer}>
                <Carousel             
                    ref={cardRef}
                    data={progressArr}
                    renderItem={_renderItem}                
                    sliderWidth={400}        
                    itemWidth={350}     
                    activeSlideAlignment={'center'}
                    slideStyle={{justifyContent: 'center', alignItems: 'center'}}
                    onSnapToItem={(index) => setYAxis(sampleData[index].x)}
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
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    diagrammContainer: {        
        flex: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //paddingLeft: '5%',
    },
    historyContainer: {        
        flex: 3,
        width: '100%',
        paddingTop: '5%',        
    },
    slide: {
        backgroundColor: '#b5c8d7', 
        width: '100%', 
        height: '80%', 
        borderRadius: 20, 
        justifyContent: 'space-around',
        paddingLeft: '5%',        
    },
    progressBarContainer: {
        backgroundColor: '#cddae4',
        width: '95%', 
        height: '30%', 
        justifyContent: 'center',        
        borderRadius: 20,        
        paddingLeft: '2%',     
    },
});
