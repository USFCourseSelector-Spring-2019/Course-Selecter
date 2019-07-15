const puppeteer = require('puppeteer');
let username = process.env.USF_USERNAME;
let password = process.env.USF_PASSWORD;
try {
    const CREDS = require('../creds');
    password = CREDS.password
    username = CREDS.username
} catch (err) {
    console.log('Using credentials provided in the env...')
}

const scrape = async ({ offset = 0, headless = true } = {}) => {
    try {
        const browser = await puppeteer.launch({
            headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        console.log(`Scraping courses with the ${headless ? 'headless' : ''} browser...`)
        await page.goto('https://usfcas.usfca.edu/cas/login?service=https%3A%2F%2Faphrodite01.usfca.edu%3A8010%2Fssomanager%2Fc%2FSSB%3Fpkg%3Dhttps%3A%2F%2Fhebe.usfca.edu%2Fprod%2Ftwbkwbis.P_GenMenu%3Fname%3Dbmenu.P_StuMainMnu');
        await page.click('#username');
        await page.keyboard.type(username);
        await page.click('#password');
        await page.keyboard.type(password);
        await Promise.all([
            page.click('button.sign-in-submit-btn'),
            page.waitForNavigation()
        ])
        await page.waitForNavigation()
        let need_to_agree = false
        do {
            await Promise.all([
                page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(1) > td:nth-child(2) > a'),
                page.waitForNavigation()
            ])
            await Promise.all([
                page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(2) > td:nth-child(2) > a'),
                page.waitForNavigation()
            ])
            need_to_agree = await page.evaluate(() => {
                const agree = document.querySelector('body > div.pagebodydiv > table.dataentrytable > tbody > tr > td > input[type="submit"]:nth-child(1)')
                if (agree) {
                    agree.click()
                    return true;
                }
                return false
            })
            if (need_to_agree) {
                await Promise.all([await page.waitForNavigation(),
                await page.click('body > div.pagebodydiv > a:nth-child(4)'),
                await page.waitForNavigation()
                ])
            }
        } while (need_to_agree);
        //await page.waitForNavigation();
        await page.evaluate((offset) => {
            document.querySelector(`select option:nth-child(${offset + 2})`).selected = true
        }, offset)
        await Promise.all([
            page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(5)'),
            page.waitForNavigation()
        ])
        await page.evaluate(() => {
            document.querySelector('#subj_id > option:nth-child(1)').selected = true
        })
        await Promise.all([
            page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(20)'),
            page.waitForNavigation({ timeout: 0 })
        ])
        let bodyHTML = await page.evaluate(() => document.body.innerHTML)
        console.log("Scraped Successfully!")
        browser.close();
        return bodyHTML;
    } catch (err) {
        return Promise.reject(err)
    }
};
if (!module.parent) {
    scrape().then((value) => {
        console.log(value); // Success!
    });
}
module.exports = scrape