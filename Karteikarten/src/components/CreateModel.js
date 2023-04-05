/**
 * @file CreateModel for RefCard
 * @author Fatih Yanar <fatih_yanar@gmx.de>
 */

import React, {useState} from "react";
import {
    FlatList,
    LogBox,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
} from "react-native";

import {Button, IconButton, TextInput as TextInputRNP} from "react-native-paper"
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import Icon from "react-native-vector-icons/Ionicons";
import {SafeAreaView} from 'react-native-safe-area-context';


import stylejs from "../style";
import {noSpaces} from "../utilities/Validation";

LogBox.ignoreLogs(['Setting a timer']);

function CreateModel({navigation}) {

    const [modalOpen, setModalOpen] = useState(true);
    const [catId, setCatId] = useState("a");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modalCatOpen, setModalCatOpen] = useState(false);
    const [modalCatFormOpen, setModalCatFormOpen] = useState(false);
    const [catName, setCatName] = useState('select category');
    const [categories, setCategories] = useState([])
    const [categoryColor, setCategoryColor] = useState({
            left: "#2B32B2",
            right: '#1488CC',
        }
    )
    const [touched, setTouched] = useState(4);

    let idd;

    /**
     * Saves Category and adds them to the Firestore Database
     * @returns {Promise<void>}
     */
    async function saveCategory() {
        // Check if the Category already exists, sets exists = true
        let exists = true;

        if (exists === true) {
            await firebase.firestore()
                .collection('category')
                .add(
                {
                    titel: catName,
                    color: categoryColor
                }
            ).then((collRef) => {
                idd = collRef.id;
                setCatId(idd)
                setModalCatFormOpen(false);
            });
        }
    }

    /**
     * Get all Categories from the Database and save them into the current Category Array
     */
    const getCategories = () => {
        firebase.firestore().collection('category').onSnapshot(snapshot => {
            const arr = snapshot.docs.map((doc) => ({
                label: doc.data().titel,
                id: doc.id
            }))
            setCategories(arr)
        })

    }

    /**
     * Creates a new Theme in the given Category
     * @returns {Promise<void>}
     */
    const createTheme = async () => {
        await firebase
            .firestore()
            .collection('category')
            .doc(catId)
            .collection("set")
            .add({
                title: title,
                description: description,
                date: new Date()
            }).then(collRef => {
                navigation.navigate("CreateCard", {id: collRef.id, catId, titel: title, categoryColor});
            });
    }

    /**
     * A Render method that renders each Category
     * @param item : any
     * @returns {JSX.Element}
     */
    const renderItem = ({item}) => {
        return (
            <TouchableOpacity
                style={{padding: 10, backgroundColor: '#EDEDED', marginBottom: 10}}
                onPress={() => {
                    setCatName(item.label);
                    idd = item.id;
                    setCatId(idd);
                    setModalOpen(true);
                    setModalCatOpen(false);
                }}
            >
                <Text>
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    }

    /**
     * Sets the Color of the new Category
     * @param c : any
     */
    const setColor = (c) => {
        setCategoryColor(c)
    }

    /**
     * ModalHeader Component for the creation of a Set/Category
     * @param p : any
     */
    const ModalHeader = (p) => {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#add8e6',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View style={[stylejs.header, {width: "100%", alignItems: "flex-start", justifyContent: "center"}]}>
                    <TouchableOpacity onPress={() => {
                        navigation.goBack();
                    }} style={{flex :1}}>
                        <Icon name='chevron-back-sharp' size={50} color='black'/>
                    </TouchableOpacity>
                    <Text style={[stylejs.modal_text, {color: "white", flex: 4, textAlign: "center", height:"100%",top:"2%",}]}>{p.headerText}</Text>
                    <Text style={{flex :1 }}></Text>
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: "center",
                    bottom: "-70%",
                }}>
                    <View style={{
                        borderRadius: 150,
                        borderWidth: 10,
                        borderColor: "white",
                        backgroundColor: "white",
                        padding: 10
                    }}>
                        <Image
                            source={require("../asserts/Logonew.png")}
                            style={{
                                width: 120,
                                height: 80,
                            }}>
                        </Image>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <>
            {/*Main*/}
            <Modal visible={modalOpen} animationType='slide'>
                <SafeAreaView style={{flex:1}}>
                <ModalHeader
                    headerText="Create a new Set"
                />
                {/*Bottom site of the Modal.*/}
                <View style={[styles.modalBottomArea]}>

                    <View style={styles.inputView}>
                        <Text style={stylejs.modal_text}>Title</Text>
                        <TextInput testID="CreateModalTextInputTITLE"
                            style={styles.input}
                            placeholder={'e.g. Linear Algebra'}
                            onChangeText={(val) => {
                                setTitle(val)
                            }}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Text style={stylejs.modal_text}>Description</Text>
                        <TextInput testID="CreateModalTextInputDESCRIPTION"
                            multiline
                            style={styles.input}
                            placeholder={'Example description'}
                            onChangeText={(val) => setDescription(val)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Text style={stylejs.modal_text}>Category</Text>
                        <TouchableOpacity
                            testID="CreateModalSelectCategoryBTN"
                            style={[styles.input, {
                                borderWidth: 2,
                                borderRadius: 15,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }]}
                            onPress={() => {
                                getCategories();
                                setModalCatOpen(true);
                            }}>
                            <Text>{catName}</Text>
                            <MaterialIcons
                                name='arrow-drop-down'
                                size={23}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <Button
                            style={stylejs.defaultButton}
                            onPress={() => {
                                console.log(title);
                                if (catName === 'select category') {
                                    console.log("alert no cat")
                                } else {
                                    if (noSpaces('Titel', title) || noSpaces('Beschrebiung', description)) {
                                    } else {
                                        createTheme().then(() => console.log("Theme successfully created"));
                                    }
                                }
                            }}>
                            <Text style={[stylejs.modal_text, {color: "white"}]}>Create</Text>
                        </Button>
                    </View>
                </View>
                </SafeAreaView>
            </Modal>
            {/*select Category*/}
            <Modal testID="SelectCategoryModal" visible={modalCatOpen} animationType='slide'>
                <SafeAreaView style={{flex:1}}>
                <ModalHeader
                    headerText="Select a Category"
                />
                <SafeAreaView style={styles.modalBottomArea}>
                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item + index}
                    />
                </SafeAreaView>
                <View style={{position: 'absolute', bottom: 20, right: 20}}>
                    <IconButton
                        testID="CreateModalCreateCategoryBTN"
                        style={{backgroundColor: '#FD4365'}}
                        icon="plus"
                        color={'#FFF'}
                        size={38}
                        onPress={() => setModalCatFormOpen(true)}/>
                </View>
                </SafeAreaView>
            </Modal>
            <Modal testID="CreateCategoryModal" visible={modalCatFormOpen} animationType='slide'>
                <SafeAreaView style={{flex:1}}>
                <ModalHeader
                    headerText="Create a new Category"
                />
                <View style={[styles.modalBottomArea]}>
                    <TextInputRNP mode='outlined'
                                  label="Name"
                                  onChangeText={text => setCatName(text)}
                    />
                    {/*Pick/Change Color*/}
                    <View style={{marginTop: 20, flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                        <TouchableOpacity
                            testID="CreateModalPickLEFTColorBTN"
                            style={[styles.colorButtons, touched === 0 ? styles.borderWidth : styles.nonBorderWidth, {backgroundColor: "#FF9C0D"}]}
                            onPress={() => {
                                setTouched(0);
                                setColor({
                                    left: "#FF9C0D",
                                    right: "#ffb74e"
                                });
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.colorButtons, touched === 1 ? styles.borderWidth : styles.nonBorderWidth, {backgroundColor: "#fe357d"}]}
                            onPress={() => {
                                setTouched(1);
                                setColor({
                                    left: "#fe357d",
                                    right: "#fe6ba0"
                                });
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.colorButtons, touched === 2 ? styles.borderWidth : styles.nonBorderWidth, {backgroundColor: "#2B32B2"}]}
                            onPress={() => {
                                setTouched(2);
                                setColor({
                                    left: "#2B32B2",
                                    right: '#1488CC',
                                });
                            }}
                        />
                    </View>
                    <View style={{marginTop: 20, flex: 3}}>
                        <Button
                            style={stylejs.defaultButton}
                            onPress={() => {
                                saveCategory().then(() => console.log("Category successfully created"));
                            }}>
                            <Text style={[stylejs.modal_text, {color: "white"}]}>Create</Text>
                        </Button>
                    </View>
                </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        justifyContent: "space-between",
        height: 60,
        borderBottomWidth: 2, borderColor: '#777',
        fontSize: 16,
        padding: 8,
    },
    modalBottomArea: {
        marginHorizontal: 20, flex: 5, marginTop: 80
    },
    colorButtons: {
        height: "50%", width: "30%", borderRadius: 10, margin: 4
    },
    borderWidth: {
        borderWidth: 2, borderColor: 'black'
    },
    nonBorderWidth: {
        borderWidth: 0,
    },
    inputView: {
        marginVertical: 20
    },
})

export default CreateModel;
