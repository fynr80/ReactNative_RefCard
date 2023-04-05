/**
 * @file Return Set Buttons for SetStatisticScreen.js
 * @author Fatih Yanar fatih_yanar@gmx.de
 * @author Cuong Duc Nguyen cuong.duc.nguyen@mni.thm.de
 */

 import * as React from 'react';
 import {
     View,
     Text,
     TouchableOpacity,     
 } from "react-native";
 import {useNavigation} from '@react-navigation/native';

 import stylejs from "../style";

 export default function SetSets (props) {
    const categoryID = props.categoryID;
    const categoryColor = props.categoryColor;
    const setID = props.id;
    const setName = props.name;
    const navigation = useNavigation();

    /**
    * navigate to AllCardQueryStatistics.js
    * @param 
    * @returns {*}
    */
    const goToAllCardQueryStatistics = () => {        
        navigation.navigate("AllCardQueryStatistics", {categoryID, setID, setName});
     }

    return (
        <TouchableOpacity
            onPress={goToAllCardQueryStatistics}
        >
            <View 
                style={{
                    backgroundColor: categoryColor.left,
                    width: 350,
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,                    
                    borderWidth: 1,
                    marginTop: '5%'
                }}
            >
                <Text numberOfLines={2} style={[stylejs.items_titleText, {paddingLeft: '5%'}]}>{setName}</Text>
            </View>
        </TouchableOpacity>
    );
}
