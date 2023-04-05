/**
 * @file Return cards from a learning unit 
 * @author Cuong Duc Nguyen cuong.duc.nguyen@mni.thm.de
 */

 import * as React from 'react';
 import {
     View,
     Text,         
     TouchableOpacity,
     StyleSheet,
 } from "react-native";
import { useRef } from 'react';
import Carousel from 'react-native-snap-carousel';
import Icon from "react-native-vector-icons/Ionicons";
import {useNavigation} from '@react-navigation/native';

 export default function RightWrongHistory (props) {    
    const setName = props.route.params.setName;
    const dataRight = props.route.params.dataRight;
    const dataWrong = props.route.params.dataWrong;
    const cardColor = props.route.params.cardColor;
    const cardRef = useRef();  
    const navigation = useNavigation();  

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
                    <Text style={{fontWeight: 'bold', fontSize: 20, paddingRight: '25%'}}>{setName}</Text>
                </View>                             
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
                         
                <View style={styles.cardContainer}>
                    <Text>Question</Text>
                    <View style={[styles.card, {backgroundColor: cardColor}]}>
                        <Text>{item.question}</Text>
                    </View>
                    <Text>Answer</Text>
                    <View style={[styles.card, {backgroundColor: cardColor}]}>
                        <Text>{item.answer}</Text>
                    </View>
                </View>       
            </View>
        );
    }

    /**
     * Displays a emty Screen because no data is existed
     */
     if (dataRight.length == 0 && dataWrong.length == 0) {           
        return (                        
            <View style={{flex: 1}}>
                <Header/>
                <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>                    
                    <Text style={{paddingBottom: '20%'}}>empty</Text>
                </View>
            </View>                
        );
    }

    /**
    * show only the right answer from learning unit    
    */
    if(dataRight.length > 0) {
        return (
            <View style={styles.container}>  
                <Header/>                 
                <Carousel             
                    ref={cardRef}
                    data={dataRight}
                    renderItem={_renderItem}                
                    sliderWidth={400}        
                    itemWidth={350}     
                    activeSlideAlignment={'center'}
                    slideStyle={{justifyContent: 'center', alignItems: 'center'}}                
                />
            </View>
        );
    }

     /**
    * show only the weong answer from learning unit    
    */
    return (
        <View style={styles.container}>
            <Header/>   
            <Carousel             
                ref={cardRef}
                data={dataWrong}
                renderItem={_renderItem}                
                sliderWidth={400}        
                itemWidth={350}     
                activeSlideAlignment={'center'}
                slideStyle={{justifyContent: 'center', alignItems: 'center'}}                
            />
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
        height: '15%',        
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',               
    },
    slide: {        
        height: '100%',              
        width: '100%',            
    },
    cardContainer: {
        height: '80%',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    card: {        
        height: '40%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
});
