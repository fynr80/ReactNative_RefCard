import {StatusBar, StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: "2%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
        paddingHorizontal:"2%",
    },
    headerNew:{
        backgroundColor:'white',
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:2,
        paddingRight:2,
    },
    headerText:{
        fontSize:20,
        fontWeight:'bold',
    },

    screen_titleText: {
        fontWeight: "bold",
        fontSize: 34
    },

    modal_text: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    items_Container: {
        width:'100%',
        borderRadius: 30,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:20,
        marginTop: 20,
        height:180,
        flexDirection:'row',
        justifyContent:'space-between'

    },

    items_titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color:'white',
        paddingRight:30,
        maxWidth:300
    },
    items_amountText: {
        fontSize: 15,
        opacity: 0.8,
        color:'white'
    },
    items_dropdown: {paddingRight: 10},

    loadingContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingStyle: {
        flexDirection: "row",
        justifyContent: "center"
    },

    categories_button: {
        //Flex direction: "row" inside View --inline code
        flex: 1,
        //borderWidth: 1,
        //borderColor: "gray",
        //backgroundColor: "white",
        borderRadius: 50,
        padding: 10,
        marginHorizontal:5,

    },
    defaultButton: {
        backgroundColor:'#FD4365',
        justifyContent: 'center',
        borderRadius: 15,
    },



    blue: {
        backgroundColor: "lightblue",
    },
    white: {
        backgroundColor: "white",
    },

});
