import React from 'react';
import renderer from 'react-test-renderer';
import {fireEvent, render, screen} from '@testing-library/react-native'
import SetItem from "../components/SetItem";
import firebaseConfig from "../firebaseConfig";
import SetCategories from "../components/SetCategories";


const mockedNavigation = jest.fn();
jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native");
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigation,
            dispatch: jest.fn(),
        }),
    };
});

const setItem = <SetItem
    text="math"
    description="Set for math"
    category_id="2"
    category_name="Calculus"
    item_id="2.2"
    categoryColor=""/>

describe("Category List elements Component", () => {
    it('renders List element correctly', async () => {
        const tree = renderer.create(setItem).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Calls Navigation to CardDescription with Correct Params', async () => {
        const {getByText} = render(setItem);
        const button = screen.getByText("math");
        fireEvent.press(button);
        expect(mockedNavigation).toBeCalledWith("CardDescription", {
            "category_id": "2",
            "item_id": "2.2",
            "category_name": "Calculus",
            "itemName": "math",
            "item_description": "Set for math",
            "categoryColor": "",
            "questionCounter": 0,
        });
    });
    it('Calls Navigation to CardQuery with Correct Params', async () => {
        const {getByTestId} = render(setItem);
        const button = screen.getByTestId("SetItemNavToCardQueryBTN");
        fireEvent.press(button);
        expect(mockedNavigation).toBeCalledWith("CardQuery", {
            "category_id": "2",
            "item_id": "2.2",
            "categoryColor": "",
        });
    });

    it('Qustion title is correctly', () => {
        const {getByTestId} = render(setItem);
        const title = getByTestId("SearchscreenQuestionTitle");
        expect(title.props.children).toMatch("math");
    });

    it('Question Color is correctly', () => {
        const bgcolor = {
            left: "#2B32B2",
            right: '#1488CC',
        }
        const {getByTestId} = render(<SetItem
            text="math"
            description="Set for math"
            category_id="2"
            category_name="Calculus"
            item_id="2.2"
            categoryColor={bgcolor}
        />);
        const set = getByTestId("SearchscreenQuestion");
        expect(set.props.style[1].backgroundColor).toEqual(bgcolor.left);
    });
})
