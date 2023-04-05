/**
 * @file MainContainer of RefCard app
 * @author Fatih Yanar <fatih.yanar@mni.thm.de>
 */
//TODO: Author Tag!

import * as React from 'react';
import {View} from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useEffect} from "react";

// Screens
import HomeScreen from './screens/HomeScreen';
import StatisticScreen from './screens/StatisticScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from "./screens/SettingScreen";

function MainContainer({navigation}) {
    const homeName = "Home";
    const createName = "Create";
    const statisticName = "Statistic";
    const profileName = "Profile";
    const settingsName = "Settings";

    const Tab = createBottomTabNavigator();
    const CreateNew = () => <View style={{flex: 1, backgroundColor: 'red'}}/>

    /*useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log('Refreshed');
        });
        return unsubscribe;
      }, [navigation]);*/

    return (
        <Tab.Navigator            
            initialRouteName={homeName}                        
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;
                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === createName) {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';

                    } else if (rn === statisticName) {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    } else if (rn === profileName) {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (rn === settingsName) {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
                tabBarShowLabel:false,
                headerShown: false,
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'grey',
                tabBarBadgeStyle: {backgroundColor: 'blue'},
                tabBarLabelStyle: {
                    paddingBottom: 4, fontSize: 10
                },
                tabBarStyle: {
                    backgroundColor: '#F2F8FD',
                },
            })}>

            <Tab.Screen name={homeName} component={HomeScreen}/>
            <Tab.Screen name={statisticName} component={StatisticScreen}/>
            <Tab.Screen name={createName}
                        component={CreateNew}
                        listeners={({navigation}) => ({
                            tabPress: (e) => {
                                e.preventDefault();
                                navigation.navigate('Createe');
                            }
                        })}
            />
            <Tab.Screen name={profileName} component={ProfileScreen}/>
            <Tab.Screen name={settingsName} component={SettingsScreen}/>
        </Tab.Navigator>
    );
}

export default MainContainer;
