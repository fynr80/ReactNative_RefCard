import React from 'react';
import {render} from "@testing-library/react-native";
import CardQuery from "../screens/CardQuery";
import firebaseConfig from "../firebaseConfig";
import SetItem from "../components/SetItem";
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
        category_id: "2",
        item_id: "2.2",
        categoryColor: {
            left: "#2B32B2",
            right: '#1488CC',
        }
    }
}

expect.extend({toMatchImageSnapshot});

describe("Cardquery Component", () => {
    let browser;
    jest.setTimeout(35000);

    beforeAll(async () => {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    })

    it('renders correctly', async () => {
        const tree = render(<CardQuery route={route}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

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

        const startLearnBtnSelector = "#root > div > div > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-display-6koalj.r-left-1d2f490.r-pointerEvents-12vffkv.r-position-u8s1d.r-right-zchlnj.r-top-ipm5af > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-display-6koalj.r-left-1d2f490.r-pointerEvents-12vffkv.r-position-u8s1d.r-right-zchlnj.r-top-ipm5af > div.css-view-1dbjc4n.r-flex-13awgt0.r-pointerEvents-12vffkv > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div > div:nth-child(3) > div > div"
        await page.waitForSelector(startLearnBtnSelector);
        const startLearnBtn = await page.$(startLearnBtnSelector);
        startLearnBtn.click();

        await new Promise((r) => setTimeout(r, 5000));

        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    })
    /*
        Problem: Jest findet keine Elemente, welche in <CardStack/> liegen.
        it('Color of Card is correct', () => {
            const {getByTestId} = render(<CardQuery route={route}/>);
            const frontView = getByTestId("CardQueryFrontSide");
            const backView =  getByTestId("CardQueryBackSide");
            expect(frontView.props.style[1].backgroundColor).toEqual(bgcolor.left);
        });


        it('Q/A is Empty', () => {
            const {getByTestId} = render(<CardQuery route={route}/>);
            const Q = getByTestId("QCardQueryFrontSide");
            const A =  getByTestId("QCardQueryBackSide");
            expect(Q).toMatch("");
            expect(A).toMatch("");
            //Immer "" weil wir die Elemente von Firebase holen und nicht übergeben
        });
        */


})
