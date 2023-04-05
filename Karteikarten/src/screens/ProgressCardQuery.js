/**
 ****************************************************************************
 * @file      ProgressCardQuery
 * @author    Cuong Duc Nguyen
 * @version   3.1
 * @date      02.07.2022
 * @brief     This module is used to show the progress of querry cards.
*/

//import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import {
    ActivityIndicator,
    LogBox,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {Button} from 'react-native-paper'
import CircularProgress from 'react-native-circular-progress-indicator';
import Carousel from 'react-native-snap-carousel';
import firebase from "firebase/compat";
import * as Progress from 'react-native-progress';
import {useNavigation} from '@react-navigation/native';

import stylejs from "../style";
import {average} from "../utilities/Progress";

export default function ProgressCardQuery(props) {
  const category_id = props.route.params.category_id;
  const item_id = props.route.params.item_id;
  const [data, setData] = useState([]);
  const cardRef = useRef();
  const navigation = useNavigation();

  /**
  * Retrieve all the questions and store them in the array of questions used for the query
  */
  useEffect(() => {
    //getProgress();
    const unsubscribe = firebase
          .firestore()
          .collection('category')
          .doc(category_id)
          .collection('set')
          .doc(item_id)
          .collection('progress')
          .onSnapshot(snapshot => {
            const arr = snapshot.docs.map((doc) => ({
                id: doc.id,
                right: doc.data().right,
                wrong: doc.data().wrong,
                date: doc.data().date,
                time: doc.data().time,
                numberOfMilliseconds: doc.data().numberOfMilliseconds,
                dataRight: doc.data().dataRight,
                dataWrong: doc.data().dataWrong,
              }))
              const bufferArr = arr.sort((a, b) => a.numberOfMilliseconds - b.numberOfMilliseconds);
              setData(bufferArr);
          });
      // cleanup with a call to unsubscribe
      return () => {unsubscribe()};
  }, []);

  LogBox.ignoreLogs(["ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'."]);

  //Alle Ergebnisse der Karteikartenabfrage eines sets werden in einem neuen Array gespeichert.
  //Diese Hilfsfunktion wird für die Berechnung des Mittelwertes benötigt.
  function __AllScores(arr) {
    const myArr = [];
    for(var i = 0; i < arr.length; i++) {
      myArr.push(arr[i].right/(arr[i].right + arr[i].wrong) * 100);
    }
    return myArr;
  }

  const _renderItem = ({item, index}) => {
    return (
        <View
          style={styles.cardContainer}
        >
          {/*date*/}
          <View style={{width: '100%', height: '30%', justifyContent: 'center', marginLeft: '10%'}}>
            <Text>{ `${new Date(item.date).getDate()}.${new Date(item.date).getMonth()}.${new Date(item.date).getFullYear()},   ${item.time}`}</Text>
          </View>
          {/*right bar*/}
          <View style={styles.progressBarContainer}>
            <Text >Gewusst: {item.right} von {item.right+item.wrong}</Text>
            <Progress.Bar
              progress={item.right/(item.right+item.wrong)}
              width={300}
              color={'green'}
            />
          </View>
          {/*wrong bar*/}
          <View style={styles.progressBarContainer}>
            <Text>Vergessen: {item.wrong} von {item.right+item.wrong}</Text>
            <Progress.Bar
              progress={item.wrong/(item.right+item.wrong)}
              width={300}
              color={'red'}
            />
          </View>
        </View>
    );
  }

  /**
     * Displays a loading Screen while the Data is being fetched
     */
  if (data.length == 0) {
    console.log('data ist leer');
    return (
        <View testID="ProgressCardQueryLoadingScreen" style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#00ff00'/>
        </View>
    );
  }

  const CardCarousel = (props) => {
    if(props.data.length > 0) {
      return (
        <View style={styles.carouselContainer}>
            <Text style={{fontSize: 20}}>Session</Text>
            <Carousel
                ref={props.refCard}
                data={props.data}
                renderItem={props.renderItem}
                sliderWidth={400}
                itemWidth={350}
                layout={'stack'}
                layoutCardOffset={18}
                firstItem={props.data.length - 1}
            />
        </View>
      );
    }

    return <View style={styles.carouselContainer}></View>
  };

  return (
    <View style={styles.container}>
        <View style={styles.circularProgressContainer}>
          <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: '5%'}}>Average Grade</Text>
          <CircularProgress
              value={average(__AllScores(data))}
              valueSuffix={'%'}
              radius={120}
              activeStrokeColor={'#2ecc71'}
              inActiveStrokeColor={'#9b59b6'}
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={20}
              inActiveStrokeWidth={40}
              progressValueColor={'#2ecc71'}
          />
        </View>

        <CardCarousel refCard={cardRef} data={data} renderItem={_renderItem}/>
        <Button
          style={[stylejs.defaultButton, {marginBottom: '5%'}]}
          onPress={() => {
            navigation.navigate('Main');
          }}
        >
          <Text style={[stylejs.modal_text, {color: "white"}]}>Finish</Text>
        </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  circularProgressContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    alignItems: 'center',
    paddingTop: '10%',
  },
  carouselContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#b5c8d7',
    width: '100%',
    height: '80%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    marginLeft: '10%',
  },
});
