/**
 * @file Validation functions of RefCard app
 * @author Cuong Duc Nguyen <cuong.duc.nguyen@mni.thm.de>
 */


import { Alert } from "react-native";

/**
 * Alert is displayed if the input is empty. Spaces are automatically removed.
 * @param title : String
 * @param text : String
 * @returns boolean
 */
export function noSpaces(title ,text) {
    console.log(text);
    if(text === '') {
        Alert.alert(
            `Error in ${title}`,
            'Input is required!',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
            ]
        )
        return true;
    }
    return false;
}

/**
 * Alert is displayed if the input reach maximum input.
 * @param title : String
 * @param text : String
 * @returns {void}
 */
export function maxInput(title, text) {
    if(text.length > 100) {
        return (
            Alert.alert(
                'Error',
                'Maximum input of 100 characters was exceeded!',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                ]
            )
        );
    }
}
