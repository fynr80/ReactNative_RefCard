/**
 * @file SearchScreen of RefCard app
 * @author Kaan Eray <kaan.eray@mni.thm.de>
 */


import * as React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Pressable,
    StyleSheet, Alert
} from 'react-native';
import {useEffect, useState} from "react";

import firebase from "firebase/compat";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Ionicons";
import {Searchbar} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import Modal from "react-native-modal"

import stylesjs from "../style"
import SetItem from "../components/SetItem";

const SearchScreen = (props) => {
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [fullItems, setFullItems] = useState([])
    const [orderBy, setOrderBy] = useState("none")
    const [showModal, setShowModal] = useState(false)
    const [iconName, setIconName] = useState("unsorted")

    const navigation = useNavigation()

    const category_name = props.route.params.categoriesName
    const category_id = props.route.params.id
    const categoryColor = props.route.params.categoryColor
    const path = "category/" + category_id + "/set"
    const options = ["Ascending", "Descending", "Title"]


    useEffect(() => {
        let subscriber;
        setIsLoading(true)
        subscriber = firebase.firestore()
            .collection(path)
            .onSnapshot(querySnapshot => {
                const itemList = [];
                querySnapshot.forEach(docSnapshot => {
                    itemList.push({
                        ...docSnapshot.data(),
                        id: docSnapshot.id
                    })
                })
                setItems(itemList)
                setFullItems(itemList)
                setIsLoading(false)
            })
        return () => {
            subscriber()
        }
    }, [])

    /*
    * Alert for Delete
    * */
    const button = () => {
        Alert.alert(
            'Delete Category',
            'Do you really want to delete this Category with all the Sets included?',
            [
                {
                    text: 'No', onPress: () => {
                        console.log('No Pressed')
                    }
                },
                {
                    text: 'Yes', onPress: () => {
                        //deleteSet().then(() => {
                            console.log('Collection and all Sub collections deleted');
                            deleteCategory(category_id);
                            navigation.goBack();
                        //})
                    }
                },
            ]
        );
    }



    /**
     * Searches and filters the Items to the given SearchText
     */
    const searchItem = () => {
        if (items === undefined) return
        let filteredItems
        const query = searchText.toLowerCase()
        filteredItems = fullItems
            .filter(item => {
                return item.title.toLowerCase().indexOf(query) > -1
            })
        setItems(filteredItems)
    }


    useEffect(() => {
        return searchItem()
    }, [searchText])

    useEffect(() => {
        if (orderBy === "asc" || orderBy === "desc") orderItems(compareDate)
        else if (orderBy === "title") orderItems(compareTitle)
    }, [orderBy])

    /**
     * Function to order the Items with the given criteria
     * @param func : function
     */
    const orderItems = (func) => {
        const reOrderedItems = [...items].sort((a, b) => func(a, b))
        setItems(reOrderedItems)
    }

    /**
     * Compares the date of each item in the Set and returns the result of the comparison
     * @param a : any
     * @param b : any
     * @returns {number}
     */
    function compareDate(a, b) {
        const res = b.date.seconds - a.date.seconds
        return orderBy === "asc" ? -res : res
    }

    /**
     * Compares the title of each item in the Set and returns the result of the comparison
     * @param a : any
     * @param b : any
     * @returns {number}
     */
    function compareTitle(a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    }

    /**
     * Deletes the given Category with the given id
     * @param category_id : String
     */
    const deleteCategory = (category_id) => {
        deleteSet(category_id);
        firebase.firestore()
            .collection('category')
            .doc(category_id).delete()
            .then(() => {
                console.log('Deleted successfully')
            }).catch(() => {
            console.log('Deletion failed')
        })
    }

    /**
     * Deletes the theme with the associated sets
     * @param category_id : String
     */
    const deleteSet = (category_id) => {
        // Get all items
        // Loop through all Themes and delete them
        const subscriber = firebase.firestore()
            .collection('category')
            .doc(category_id)
            .collection("set")
            .get().then(res => {
            res.forEach(element => {
                deleteQuestion(element.id).then(() => console.log("Set Question successfully deleted"))
                deleteProgress(element.id).then(() => console.log("Set Progress successfully deleted"))
                element.ref.delete().then(() => console.log(""));
                console.log("Deleted Set")
            })
        })
        return () => {subscriber()};
    }

    /**
     * Deletes the questions in the associated theme
     * @param themeId : String
     */
    const deleteQuestion = async (themeId) => {
        console.log(themeId)
        await firebase.firestore()
            .collection('category').doc(category_id).collection('set').doc(themeId).collection('card').get().then(res => {
                res.forEach(element => {
                    element.ref.delete();
                    console.log("Deleted Question")
                })
            })
    }

    /**
     * Deletes the progress in the associated theme
     * @param themeId : String
     */
     const deleteProgress = async (themeId) => {
        console.log(themeId)
        await firebase.firestore()
            .collection('category').doc(category_id).collection('set').doc(themeId).collection('progress').get().then(res => {
                res.forEach(element => {
                    element.ref.delete();
                    console.log("Deleted Progress")
                })
            })
    }

    /**
     * A render method, to render each item entry in the Popup menu
     * @param item : any
     * @returns {JSX.Element}
     */
    const renderItem = ({item}) => (
        <View style={{backgroundColor: "#e6e6e6", padding: "1%"}}>
            <Pressable
                style={[styles.optionItemStyle, {
                    backgroundColor: "white",
                }]}
                onPress={() => {
                    const action = item.toString()
                    if (action === "Ascending") {
                        setIconName("sort-amount-asc")
                        setOrderBy("asc")
                    } else if (action === "Descending") {
                        setIconName("sort-amount-desc")
                        setOrderBy("desc")
                    } else if (action === "Title") {
                        setIconName("sort-alpha-asc")
                        setOrderBy("title")
                    }
                    setShowModal(!showModal)
                }
                }
            >
                <Text style={styles.optionItemText}>{item}</Text>
            </Pressable>
        </View>
    );

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

    /**
     * Render method for empty Sets
     * @returns {JSX.Element}
     */
    const renderEmpty = () => (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text
                style={{marginTop: "10%", fontWeight: "bold", textAlign: "center", fontSize: 18}}>No Sets</Text>
        </View>
    )

    /**
     *  Renders a loading Screen, when the data is being fetched from the firebase database,
     *  otherwise a list of the current state of the items
     */
    return (
        <SafeAreaView style={stylesjs.container}>
            <View style={stylesjs.headerNew}>
                <TouchableOpacity testID="SearchBackbtn" onPress={() => {
                    navigation.goBack();
                }}>
                    <Icon name='chevron-back-sharp' size={50} color='#FD4365'/>
                </TouchableOpacity>
                <Text testID="SearchscreenTitle" style={stylesjs.headerText}>{category_name}</Text>
                <TouchableOpacity testID="SearchscreenDeletebtn" onPress={() => {
                    button();
                }}>
                    <Icon name='trash-outline' size={35} color='#FD4365'/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, padding: "1%", flexDirection: "row", alignItems: "center"}}>
                <Searchbar
                    testID="SearchscreenSearchbar"
                    style={{borderRadius: 10, flex: 1}}
                    placeholder="Search"
                    onChangeText={(text) => setSearchText(text)}
                    value={searchText}
                />
                <TouchableOpacity
                    onPress={() => setShowModal(!showModal)}>
                    <FontAwesome name={iconName} size={24} style={{padding: "2%"}}/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 9}}>
                {isLoading
                    ?
                    <View style={stylesjs.loadingContainer}>
                        <ActivityIndicator style={stylesjs.loadingStyle} size="large" color="#0377fc"/>
                        <Text>Loading</Text>
                    </View>
                    :
                    <FlatList
                        data={items}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({item}) => <SetItem text={item.title}
                                                         description={item.description}
                                                         category_id={category_id}
                                                         category_name={category_name}
                                                         item_id={item.id}
                                                         categoryColor={categoryColor}
                        />}
                        ListEmptyComponent={renderEmpty}
                    />}
            </View>
            <View>
                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => setShowModal(!showModal)}
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
        </SafeAreaView>
    );
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

export default SearchScreen
