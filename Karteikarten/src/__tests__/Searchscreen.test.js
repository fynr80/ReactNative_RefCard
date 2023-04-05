import React from 'react';
import SearchScreen from "../screens/SearchScreen";
import {NavigationContainer} from "@react-navigation/native";
import {fireEvent, render} from "@testing-library/react-native";
import firebaseConfig from "../firebaseConfig";
import {toMatchImageSnapshot} from "jest-image-snapshot"
import {Alert} from 'react-native';

const puppeteer = require("puppeteer")

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

const route = {params: {id: "aidnawinafna", categoriesName: "MyCategory", categoryColor: '#FD4365'}}

expect.extend({toMatchImageSnapshot});

describe("SearchScreen Component", () => {
    let browser;
    jest.setTimeout(35000);

    beforeAll(async () => {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    })

    it('renders correctly', async () => {
        const navigate = jest.fn();
        const route = {params: {id: "aidnawinafna", categoriesName: "MyCategory", categoryColor: '#FD4365'}}
        const tree = render(
            <NavigationContainer>
                <SearchScreen route={route} navigation={{navigate}}/>
            </NavigationContainer>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("it makes a screenshot", async () => {
        const page = await browser.newPage();
        await page.goto('http://localhost:19006');
        await page.waitForSelector("#animatedComponent > div > div > div > div.css-view-1dbjc4n.r-alignItems-1awozwy.r-backgroundColor-14lw9ot.r-flex-1q4bek2.r-flexDirection-eqz5dr.r-justifyContent-1wtj0ep.r-paddingLeft-1hfyk0a.r-paddingRight-1qfoi16 > div > div > div > div:nth-child(1) > div");
        const clickSet = await page.$("#animatedComponent > div > div > div > div.css-view-1dbjc4n.r-alignItems-1awozwy.r-backgroundColor-14lw9ot.r-flex-1q4bek2.r-flexDirection-eqz5dr.r-justifyContent-1wtj0ep.r-paddingLeft-1hfyk0a.r-paddingRight-1qfoi16 > div > div > div > div:nth-child(1) > div");
        clickSet.click();
        await new Promise((r) => setTimeout(r, 5000));

        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    })

    it('Searchscreen Title is correct', () => {
        const {getByTestId} = render(<SearchScreen route={route} navigation={{mockedNavigation}}/>);
        const title = getByTestId("SearchscreenTitle");
        expect(title.props.children).toMatch("MyCategory");
    });

    it('Delete Category Popup opened correctly', () => {
        jest.spyOn(Alert, 'alert');
        const {getByTestId, getByText} = render(<SearchScreen route={route} navigation={{mockedNavigation}}/>);
        const button = getByTestId("SearchscreenDeletebtn");
        fireEvent.press(button);
        expect(Alert.alert).toBeCalled()
    });

    it('Searchbar Placeholder is correct', () => {
        const {getByTestId, getByText} = render(<SearchScreen route={route} navigation={{mockedNavigation}}/>);
        const placeholder1 = getByTestId("SearchscreenSearchbar");
        expect(placeholder1.props.placeholder).toMatch("Search");
    });

    /*
it('Flatlist is Empty',  () => {
    const {getByText} = render(<SearchScreen route={route} navigation={{ mockedNavigation }}/>);
    getByText("No Sets")
});
*  Loading dauerschleife deshalb finden wir die Sewts nicht. Loading löschen = findet set
* */


})
