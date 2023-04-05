import React from 'react';
import {fireEvent, render} from '@testing-library/react-native'
import firebaseConfig from "../firebaseConfig";
import renderer from "react-test-renderer";
import ProgressCardQuery from "../screens/ProgressCardQuery";

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

const route = {
    params: {
        category_id: "2",
        item_id: "2.2",
    }
}


describe("ProgressCardQuery Components", () => {
    it('renders correct when there is no data', () => {
        const tree = render(<ProgressCardQuery route={route} navigation={{mockedNavigation}}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Shows LoadingScreen when there is no data', () => {
        const {getByTestId} = render(<ProgressCardQuery route={route} navigation={{mockedNavigation}}/>);
        const loadingscreen = getByTestId("ProgressCardQueryLoadingScreen");
        expect(loadingscreen).not.toEqual(undefined);
    });
})
