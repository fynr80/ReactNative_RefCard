import React from 'react';
import {fireEvent, render} from '@testing-library/react-native'
import CreateModel from "../components/CreateModel";
import firebaseConfig from "../firebaseConfig";
import renderer from "react-test-renderer";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
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

expect.extend({toMatchImageSnapshot});

describe("CreateModal Components", () => {
    let browser;
    jest.setTimeout(35000);

    beforeAll(async () => {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    })

    it('renders correctly', async () => {
        const tree = renderer.create(<CreateModel/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("it makes a screenshot", async () => {
        const page = await browser.newPage();
        await page.goto('http://localhost:19006');

        const openModalSelector = "#root > div > div > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-display-6koalj.r-left-1d2f490.r-pointerEvents-12vffkv.r-position-u8s1d.r-right-zchlnj.r-top-ipm5af > div.css-view-1dbjc4n.r-flex-13awgt0.r-pointerEvents-12vffkv > div > div > div > div.css-view-1dbjc4n.r-flex-13awgt0 > div > div.css-view-1dbjc4n.r-bottom-1p0dtai.r-left-1d2f490.r-pointerEvents-105ug2t.r-right-zchlnj > div.css-view-1dbjc4n.r-flex-13awgt0.r-flexDirection-18u37iz > a:nth-child(3)";
        await page.waitForSelector(openModalSelector);
        const openModal = await page.$(openModalSelector);
        openModal.click();

        await new Promise((r) => setTimeout(r, 5000));

        const image1 = await page.screenshot();

        const setCategorySelector = "body > div:nth-child(5) > div > div.css-view-1dbjc4n > div > div > div > div.css-view-1dbjc4n.r-flex-kgf08f.r-marginHorizontal-1n9sb9w.r-marginTop-19tq15n > div:nth-child(3) > div.css-view-1dbjc4n.r-alignItems-1awozwy.r-borderBottomWidth-wgabs5.r-borderColor-1lnm5ts.r-cursor-1loqt21.r-flexDirection-18u37iz.r-fontSize-ubezar.r-height-uvuy5l.r-justifyContent-1wtj0ep.r-padding-edyy15.r-touchAction-1otgn73.r-transitionProperty-1i6wzkk.r-userSelect-lrvibr";
        await page.waitForSelector(setCategorySelector);
        const setCategory = await page.$(setCategorySelector);
        setCategory.click();

        await new Promise((r) => setTimeout(r, 5000));

        const image2 = await page.screenshot();

        expect(image1).toMatchImageSnapshot();
        expect(image2).toMatchImageSnapshot();
    })

    it('Title Placeholder is correct', () => {
        const {getByTestId} = render(<CreateModel navigation={{mockedNavigation}}/>);
        const title = getByTestId("CreateModalTextInputTITLE");
        expect(title.props.placeholder).toMatch("e.g. Linear Algebra");
    });

    it('Description Placeholder is correct', () => {
        const {getByTestId} = render(<CreateModel navigation={{mockedNavigation}}/>);
        const title = getByTestId("CreateModalTextInputDESCRIPTION");
        expect(title.props.placeholder).toMatch("Example description");
    });

    it('SelectCategory Modal opens correctly', () => {
        const {getByTestId} = render(<CreateModel navigation={{mockedNavigation}}/>);
        const btn = getByTestId("CreateModalSelectCategoryBTN");
        const modal = getByTestId("SelectCategoryModal");
        expect(modal.props.visible).toEqual(false);
        fireEvent.press(btn);
        expect(modal.props.visible).toEqual(true);
    })

    it('CreateCategory Modal opens correctly', () => {
        const {getByTestId} = render(<CreateModel navigation={{mockedNavigation}}/>);
        const btn = getByTestId("CreateModalCreateCategoryBTN");
        const modal = getByTestId("CreateCategoryModal");
        expect(modal.props.visible).toEqual(false);
        fireEvent.press(btn);
        expect(modal.props.visible).toEqual(true);
    })

    it('Set Border by picking Color correctly', () => {
        const {getByTestId} = render(<CreateModel navigation={{mockedNavigation}}/>);
        const btn = getByTestId("CreateModalPickLEFTColorBTN");
        expect(btn.props.style.borderWidth).toEqual(0);
        fireEvent.press(btn);
        expect(btn.props.style.borderWidth).toEqual(2);
    })
});
