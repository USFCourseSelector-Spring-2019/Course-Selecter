const puppeteer = require('puppeteer');
const CREDS=require('./creds')

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://usfcas.usfca.edu/cas/login?service=https%3A%2F%2Faphrodite01.usfca.edu%3A8010%2Fssomanager%2Fc%2FSSB%3Fpkg%3Dhttps%3A%2F%2Fhebe.usfca.edu%2Fprod%2Ftwbkwbis.P_GenMenu%3Fname%3Dbmenu.P_StuMainMnu');
    await page.click('#username');
    await page.keyboard.type(CREDS.username);
    await page.click('#password');
    await page.keyboard.type(CREDS.password);
    await page.click('#fm1 > div.row.btn-row > input.btn-submit');
    await page.waitForNavigation();
    await page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(1) > td:nth-child(2) > a');
    //await page.waitForNavigation();
    await page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(2) > td:nth-child(2) > a');
    //await page.waitForNavigation();
    await page.screenshot({ path: 'screenshot.png' })
/*

    const result = await page.evaluate(() => {
        let title = document.querySelector('h1').innerText;
        let price = document.querySelector('.price_color').innerText;

        return {
            title,
            price
        }

    });*/

    browser.close();
    return 0;
};

scrape().then((value) => {
    console.log(value); // Success!
});