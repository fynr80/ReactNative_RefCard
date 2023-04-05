import React from 'react';
import {fireEvent, render} from '@testing-library/react-native'
import CardDescriptionScreen from "../screens/CardDescriptionScreen";
import {NavigationContainer} from "@react-navigation/native";
import firebaseConfig from "../firebaseConfig";
import SetCategories from "../components/SetCategories";
import {toMatchImageSnapshot} from "jest-image-snapshot";

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
const route = {
    params: {
        itemName: "math",
        item_description: "Set for math",
        category_id: "2",
        item_id: "2.2",
        categoryColor: "",
        questionCounter: 0
    }
}

expect.extend({toMatchImageSnapshot});

describe("CardDescriptionScreen Components", () => {
    let browser;
    jest.setTimeout(35000);

    beforeAll(async () => {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    })

    it('renders correctly', () => {
        const tree = render(<CardDescriptionScreen route={route} navigation={{mockedNavigation}}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
    /*it('getting back', () => {
        const {getByTestId} = render(
            <NavigationContainer>
                <CardDescriptionScreen route={route} navigation={{mockedNavigation}}/>
            </NavigationContainer>
        )
        const backbutton = getByTestId("CardDescriptionbackbutton");
        //fireEvent.press(backbutton);
    });*/
    it("it makes a screenshot", async () => {
        const page = await browser.newPage();
        await page.goto('http://localhost:19006');

        const clickSetSelector = "#animatedComponent > div > div > div > div.css-view-1dbjc4n.r-alignItems-1awozwy.r-backgroundColor-14lw9ot.r-flex-1q4bek2.r-flexDirection-eqz5dr.r-justifyContent-1wtj0ep.r-paddingLeft-1hfyk0a.r-paddingRight-1qfoi16 > div > div > div > div:nth-child(1) > div";
        await page.waitForSelector(clickSetSelector);
        const clickSet = await page.$(clickSetSelector);
        clickSet.click();

        const clickCardSelector = "#root > div > div > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-display-6koalj.r-left-1d2f490.r-pointerEvents-12vffkv.r-position-u8s1d.r-right-zchlnj.r-top-ipm5af > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-display-6koalj.r-left-1d2f490.r-pointerEvents-12vffkv.r-position-u8s1d.r-right-zchlnj.r-top-ipm5af > div.css-view-1dbjc4n.r-flex-13awgt0.r-pointerEvents-12vffkv > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div > div:nth-child(3) > div > div > div > div";
        await page.waitForSelector(clickCardSelector);
        const clickCard = await page.$(clickCardSelector);
        clickCard.click();

        await new Promise((r) => setTimeout(r, 5000));

        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    })

    it('Navigate to Learnmode', () => {
        const {getByTestId} = render(<CardDescriptionScreen route={route} navigation={{mockedNavigation}}/>);
        const learnmodeButton = getByTestId("Learn-mode");
        fireEvent.press(learnmodeButton)
        expect(mockedNavigation).toBeCalledWith('CardQuery', {
                "category_id": "2",
                "item_id": "2.2",
                "categoryColor": "",
            }
        )

    });
    it('Correct headline', () => {
        const {getByTestId} = render(<CardDescriptionScreen route={route} navigation={{mockedNavigation}}/>)
        const cardDescriptionHeadline = getByTestId("cardDescriptionHeadline");
        expect(cardDescriptionHeadline.props.children).toEqual("DESCRIPTION")
    });
    it('Correct ItemValues', async () => {
        const {getByTestId, getAllByTestId} = await render(<CardDescriptionScreen route={route}
                                                                                  navigation={{mockedNavigation}}/>)
        const cardDescriptionItemName = getByTestId("cardDescriptionItemName");
        const cardDescriptionItemDescription = getByTestId("cardDescriptionItemDescription");
        // const cardDescriptionQuestionCounter = getAllByTestId("cardDescriptionQuestionCounter");
        expect(cardDescriptionItemName.props.children).toEqual("math");
        expect(cardDescriptionItemDescription.props.children).toEqual("Set for math");
        //expect(cardDescriptionQuestionCounter.props.children).toEqual(0);

    });

});
