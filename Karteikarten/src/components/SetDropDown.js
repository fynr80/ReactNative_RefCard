/**
 * @file Item Dropdown of RefCard app
 * @author Kaan Eray <kaan.eray@mni.thm.de>
 */


import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    FlatList,
    Pressable
} from 'react-native';
import {useState} from "react";

import firebase from "firebase/compat";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";

import stylejs from "../style"

const SetDropDown = (props) => {
    const [showOptions, setShowOptions] = useState(false)
    const path = "category/" + props.categorieID + "/theme"
    const options = ["Edit", "Share", "Delete"]
    const navigation = useNavigation();

    /**
     * @description A render method, to render each item entry in the Popup menu
     * @param item
     * @returns {JSX.Element}
     */
    const renderItem = ({item}) => (
        <View style={{backgroundColor: "#e6e6e6", padding: "1%"}}>
            <Pressable
                style={[styles.optionItemStyle, {
                    backgroundColor: "white"
                }]}
                onPress={() => {
                    const action = item.toString()
                    if (action === "Edit") {
                        editSet().then(() => console.log("Called Edit"))
                    } else if (action === "Share") {
                        shareSet(props.title).then(() => {
                            console.log("Called Share");

                        } )
                    } else if (action === "Delete") {
                        button();
                    }
                    setShowOptions(!showOptions)
                }
                }
            >
                <Text style={styles.optionItemText}>{item}</Text>
            </Pressable>
        </View>
    );

    /**
     * A Confirmation Popup to delete the current Set
     */
    const button = () => {
        Alert.alert(
            'Delete Set',
            'Do you really want to delete this set with all the questions included?',
            [
                {
                    text: 'No', onPress: () => {
                        console.log('No Pressed')
                    }
                },
                {
                    text: 'Yes', onPress: () => {
                        deleteSet().then(() => {
                            console.log('Collection and all Sub collections deleted');
                            navigation.goBack();
                        })
                    }
                },
            ]
        );
    }


    /**
     * @description Deletes the current Selected Set from the database
     * @returns {Promise<void>}
     */
    const deleteSet = async () => {
        await firebase.firestore()
            .collection('category').
            doc(props.categorieID).
            collection('set').
            doc(props.item_id).
            collection('card').
            get().then(res=>{
                res.forEach(element=>{
                    element.ref.delete();
                })
            })
        
            await firebase.firestore()
            .collection('category').
            doc(props.categorieID).
            collection('set').
            doc(props.item_id).
            collection('progress').
            get().then(res=>{
                res.forEach(element=>{
                    element.ref.delete();
                })
            })

        await firebase.firestore()
            .collection(path)
            .doc(props.item_id).delete()
    }


    /**
     * @description Shares the current Set via QR-Code/Link
     * @returns {Promise<void>}
     */
    const shareSet = async (title) => {
        return Alert.alert("Share Item " + title, "Link: *Random Link*")
    }

    /**
     * @description Edit the contents of the current Set (Title, Questions, etc.)
     * @returns {Promise<void>}
     */
    const editSet = async () => {
        return Alert.alert("Edit Item ", "Modal should open here")
    }

    /**
     * Render method for the header section of the menu
     * @returns {JSX.Element}
     */
    const renderHeader = () => (
        <View>
            <View style={{
               backgroundColor: "#e6e6e6",
               padding: "2%",
               borderTopLeftRadius: 20,
               borderTopRightRadius: 20
            }}></View>
        </View>
    )

    /**
     * Render method for the footer section of the menu
     * @returns {JSX.Element}
     */
    const renderFooter = () => (
        <View>
            <View style={{backgroundColor: "#e6e6e6", padding: "4%"}}></View>
        </View>
    )

    return (
        <View>
            <Pressable
                onPress={() => {
                    setShowOptions(!showOptions)
                }}
                style={stylejs.items_Container.backgroundColor}>
                <Icon name='dots-vertical' size={30} color='#FD4365'/>
                <View>
                    <Modal
                        isVisible={showOptions}
                        onBackdropPress={() => setShowOptions(!showOptions)}
                        style={{margin: 0, justifyContent: "flex-end"}}
                        backdropTransitionOutTiming={0}
                    >
                        <View>
                            <FlatList
                                data={options}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => item + index}
                                scrollEnabled={false}
                                ListHeaderComponent={renderHeader}
                                ListFooterComponent={renderFooter}
                            />
                        </View>
                    </Modal>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    optionItemStyle: {
        padding: "1.5%",
        borderRadius: 20,
    },
    optionItemText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    }
})

export default SetDropDown
