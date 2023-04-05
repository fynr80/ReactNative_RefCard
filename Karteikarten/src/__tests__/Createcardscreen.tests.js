import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {fireEvent, render} from "@testing-library/react-native";
import CreateCard from "../screens/CreateCard";
import firebaseConfig from "../firebaseConfig";


describe("Createcard Component", () => {

    it('renders correctly', async () => {
        const navigate = jest.fn();
        const route = {params: { id: "randomID", categoriesName: "MyCategory", categoryColor: '#FD4365'}}
        const tree = render(
            <NavigationContainer>
                <CreateCard route={route} navigation={{ navigate }}/>
            </NavigationContainer>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('text change behaviour should work correctly', async () => {
        const navigate = jest.fn();
        const route = {params: { id: "randomID", catId: "randomCatId", titel: "randomTitle", categoryColor: '#FD4365'}}
        const {getByTestId} = render(
            <NavigationContainer>
                <CreateCard route={route} navigation={{ navigate }}/>
            </NavigationContainer>
        )

        const questionInput = getByTestId("QuestionTextInput");
        const answerInput = getByTestId("AnswerTextInput");

        // Text should be empty at the beginning
        expect(questionInput.props.value).toEqual("");
        expect(answerInput.props.value).toEqual("");

        // Change values of the Input
        fireEvent.changeText(questionInput, "Question 1");
        fireEvent.changeText(answerInput, "Answer 1");

        expect(questionInput.props.value).toEqual("Question 1");
        expect(answerInput.props.value).toEqual("Answer 1");

    });

})
