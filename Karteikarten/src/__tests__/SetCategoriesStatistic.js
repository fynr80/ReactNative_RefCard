import React from 'react';
import renderer from 'react-test-renderer';
import {fireEvent, render, screen} from '@testing-library/react-native'
import SetCategoriesStatistic from "../components/SetCategoriesStatistic";
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

const bgcolor = {
    left: "#2B32B2",
    right: '#1488CC',
}

describe("CategoryStatistic List elements Component", () => {
    it('renders List element correctly', () => {
        const tree = renderer.create(<SetCategoriesStatistic name='Calculus' id="2" setID="2.2" categoryColor={bgcolor} countCards="2"/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Sets Set title correctly', () => {
        const {getByTestId} = render(<SetCategoriesStatistic name='Calculus' id="2" setID="2.2" categoryColor={bgcolor} countCards="2"/>);
        const title = getByTestId("SetCategoriesStatisticTITLE");
        expect(title.props.children).toMatch("Calculus");
    });

    it('Sets item count correctly', () => {
        const {getByTestId} = render(<SetCategoriesStatistic name='Calculus' id="2" setID="2.2" categoryColor={bgcolor} countCards="2"/>);
        const count = getByTestId("SetCategoriesStatisticCOUNT");
        expect(count.props.children).toMatch("2 cards");
    });

    it('Correct Item Color', () => {
        const {getByTestId} = render(<SetCategoriesStatistic name='Calculus' id="2" setID="2.2" categoryColor={bgcolor} countCards="2"/>);
        const set = getByTestId("SetCategoriesStatisticSET");
        expect(set.props.style[1].backgroundColor).toEqual(bgcolor.left);
    });

    it('Calls Navigation with Correct Params',  () => {
        //{id, categoriesName, categoryColor, setID});
        const {getByText} = render(<SetCategoriesStatistic name='Calculus' id="2" setID="2.2" categoryColor={bgcolor} countCards="2"/>);
        const button = screen.getByText("Calculus");
        fireEvent.press(button);
        expect(mockedNavigation).toBeCalledWith("SetsStatistic", {
            "categoriesName": "Calculus",
            "categoryColor": bgcolor,
            "id": "2",
            "setID":"2.2"
        });
    });

})
