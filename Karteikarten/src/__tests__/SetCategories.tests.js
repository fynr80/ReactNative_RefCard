import React from 'react';
import renderer from 'react-test-renderer';
import {fireEvent, render, screen} from '@testing-library/react-native'
import SetCategories from "../components/SetCategories";
import firebaseConfig from "../firebaseConfig";

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


describe("Category List elements Component", () => {
    it('renders List element correctly',  () => {
        const tree = renderer.create(<SetCategories name='Calculus' id="2" categoryColor=""/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Set title is correctly',  () => {
        const {getByTestId} = render(<SetCategories name='Calculus' id="2" categoryColor=""/>);
        const title = getByTestId("homescreenSetTitle");
        expect(title.props.children).toMatch("Calculus");
    });

    it('Set Color is correctly',  () => {
        const bgcolor = {
            left: "#2B32B2",
            right: '#1488CC',
        }
        const {getByTestId} = render(<SetCategories name='Calculus' id="2" categoryColor={bgcolor}/>);
        const set = getByTestId("homescreenSet");
        expect(set.props.style[1].backgroundColor).toEqual(bgcolor.left);
    });


    it('Calls Navigation with Correct Params',  () => {
        const {getByText} = render(<SetCategories name='Calculus' id="2" categoryColor=""/>);
        const button = screen.getByText("Calculus");
        fireEvent.press(button);
        expect(mockedNavigation).toBeCalledWith("Search", {
            "categoriesName": "Calculus",
            "categoryColor": "",
            "id": "2"
        });
    });
})
