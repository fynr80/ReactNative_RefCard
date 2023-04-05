import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from "../screens/HomeScreen";
import {fireEvent, render, screen} from "@testing-library/react-native";
import firebaseConfig from "../firebaseConfig";
import {toMatchImageSnapshot} from "jest-image-snapshot"

const puppeteer = require("puppeteer")

expect.extend({toMatchImageSnapshot});

describe("HomeScreen Component", () => {
    let browser;
    jest.setTimeout(35000);

    beforeAll(async () => {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    })

    it('renders correctly', async () => {
        const tree = renderer.create(<HomeScreen/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders Text correctly', async () => {
        render(<HomeScreen/>);
        const text = screen.getByTestId("LastOpenedText");
        expect(text.props.children).toEqual("Last Opened")
    });

    it("it makes a screenshot", async () => {
        const page = await browser.newPage();
        await page.goto('http://localhost:19006');

        await new Promise((r) => setTimeout(r, 5000));

        const image1 = await page.screenshot();

        const gotoStatisticBtnSelector = "#root > div > div > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-display-6koalj.r-left-1d2f490.r-pointerEvents-12vffkv.r-position-u8s1d.r-right-zchlnj.r-top-ipm5af > div.css-view-1dbjc4n.r-flex-13awgt0.r-pointerEvents-12vffkv > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-left-1d2f490.r-pointerEvents-105ug2t.r-right-zchlnj > div.css-view-1dbjc4n.r-flex-13awgt0.r-flexDirection-18u37iz > a:nth-child(2)";
        await page.waitForSelector(gotoStatisticBtnSelector);
        const gotoStatisticBtn = await page.$(gotoStatisticBtnSelector);
        gotoStatisticBtn.click();

        await new Promise((r) => setTimeout(r, 5000));

        const image2 = await page.screenshot();

        expect(image1).toMatchImageSnapshot();
        expect(image2).toMatchImageSnapshot();
    })

    it('buttons should have correct styling', async () => {
        const {getByTestId} = render(<HomeScreen/>);
        const myCatBtn = getByTestId("MyCatBtn");
        const allCatBtn = getByTestId("AllCatBtn");

        expect(myCatBtn.props.style.backgroundColor).toEqual('#FD4365');
        expect(allCatBtn.props.style.backgroundColor).toEqual('#FBF9F9');
    });

    it('buttons should have different color after Press', async () => {
        const {getByTestId} = render(<HomeScreen/>);
        const myCatBtn = getByTestId("MyCatBtn");
        const allCatBtn = getByTestId("AllCatBtn");

        fireEvent.press(getByTestId("AllCatBtn"));

        expect(allCatBtn.props.style.backgroundColor).toEqual('#FD4365');
        expect(myCatBtn.props.style.backgroundColor).toEqual('#FBF9F9');
    });

    afterAll(async () => {
        await browser.close();
    })

})
