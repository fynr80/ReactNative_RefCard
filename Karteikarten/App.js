import React from 'react';

import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import CreateModel from "./src/components/CreateModel"
import CreateCard from "./src/screens/CreateCard"
import MainContainer from "./src/MainContainer";
import SearchScreen from "./src/screens/SearchScreen";
import CardQuery from './src/screens/CardQuery';
import ProgressCardQuery from './src/screens/ProgressCardQuery';
import HomeScreen from './src/screens/HomeScreen';
import SetsStatistic from './src/screens/SetsStatistic';
import AllCardQueryStatistics from './src/screens/AllCardQueryStatistics';
import RightWrongHistory from './src/screens/RightWrongHistory';


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import CardDescriptionScreen from "./src/screens/CardDescriptionScreen";

const firebaseConfig = {
    apiKey: "AIzaSyBksswFLr1YB6en-sRf8mqSFle7bhAzSgU",
    authDomain: "swtp-812df.firebaseapp.com",
    databaseURL: "https://swtp-812df-default-rtdb.firebaseio.com",
    projectId: "swtp-812df",
    storageBucket: "swtp-812df.appspot.com",
    messagingSenderId: "44236558384",
    appId: "1:44236558384:web:2f15f6b5fb190634b71df5",
    measurementId: "G-W33L0G7D18"
};


firebase.initializeApp(firebaseConfig);


export default function App() {

    const Stack = createStackNavigator();

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'white',
        },
    };

    return (
        <NavigationContainer theme={MyTheme}>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={MainContainer}
                              options={{headerShown: false, gestureEnabled: false}}/>
                <Stack.Screen name="Createe" component={CreateModel} options={{headerShown: false}}/>
                <Stack.Screen name="CreateCard" component={CreateCard} options={{headerShown: false}}/>
                <Stack.Screen name="Search" component={SearchScreen} options={{headerShown: false}}/>
                <Stack.Screen name="CardQuery" component={CardQuery} options={{headerShown: false}}/>
                <Stack.Screen name="ProgressCardQuery" component={ProgressCardQuery} options={{headerShown: false}}/>
                <Stack.Screen name="CardDescription" component={CardDescriptionScreen} options={{headerShown: false}}/>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>                                
                <Stack.Screen name="SetsStatistic" component={SetsStatistic} options={{headerShown: false}}/>
                <Stack.Screen name="AllCardQueryStatistics" component={AllCardQueryStatistics} options={{headerShown: false}}/>
                <Stack.Screen name="RightWrongHistory" component={RightWrongHistory} options={{headerShown: false}}/>                
                
            </Stack.Navigator>
        </NavigationContainer>
    );
}

