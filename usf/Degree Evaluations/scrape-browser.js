const puppeteer = require('puppeteer');
const CREDS = require('../creds')
const waitForLoad = (page) => new Promise((resolve) => {
    page.on('rquest', (req) => {
        waitForLoad(page)
    })
    page.on('requestfinished', (req) => {
        setTimeout(() => resolve("idle"), 3000)
    })
})

let scrape = async() => {
    const browser = await puppeteer.launch({ headless: true,ignoreHTTPSErrors:true });
    const page = await browser.newPage();
    console.log("Scraping with the browser...")
    await page.goto('https://usfcas.usfca.edu/cas/login?service=https%3A%2F%2Faphrodite01.usfca.edu%3A8010%2Fssomanager%2Fc%2FSSB%3Fpkg%3Dhttps%3A%2F%2Fhebe.usfca.edu%2Fprod%2Ftwbkwbis.P_GenMenu%3Fname%3Dbmenu.P_StuMainMnu');
    await page.click('#username');
    await page.keyboard.type(CREDS.username);
    await page.click('#password');
    await page.keyboard.type(CREDS.password);
    await Promise.all([
        page.click('button.sign-in-submit-btn'),
        page.waitForNavigation()
    ])
    console.log(2)
    await page.waitForNavigation()
    await Promise.all([
        page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(2) > td:nth-child(2) > a'),
        page.waitForNavigation()
    ])
    console.log(3)
    await Promise.all([
        page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(4) > td:nth-child(2) > a'),
        page.waitForNavigation()
    ])
    console.log(4)
    await waitForLoad(page)

    console.log(5)
    const bodyHTML = await page.evaluate(async() => {
        console.log('start')

        function checkIframeLoaded(iframe, afterLoading) {
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            console.log(iframe, iframeDoc)
            if (iframeDoc.readyState == 'complete') {
                afterLoading();
                return;
            }
            setInterval(() => checkIframeLoaded(iframe, afterLoading), 50);
        }
        const waitForFrameToLoad = frame => new Promise(resolve => checkIframeLoaded(frame, resolve));
        const iframe = document.querySelector('html > frameset > frame:nth-child(4)')
        //console.log(iframe)
        await waitForFrameToLoad(iframe)

        const content = (iframe.contentDocument || iframe.contentWindow.document)
        console.log(content, content.readyState)
        const iframe_2 = content.children[0].querySelector('html > frameset > frameset > frame:nth-child(1)')
        await waitForFrameToLoad(iframe_2)
        console.log(iframe_2)
        const content_2 = (iframe_2.contentDocument || iframe_2.contentWindow.document)
        console.log(content_2)
        console.log('end')
        content_2.children[0].querySelector('body > table > tbody > tr > td:nth-child(14) > input').click()
        //TODO: Will need to create a new scraper to scrape off of this HTML format
        return content_2.children[0].innerHTML
    })
    console.log("Scraped Successfully!")
    browser.close();
    return bodyHTML;
};
if (!module.parent) {
    scrape().then((value) => {
        console.log(value); // Success!
    });
}
module.exports = scrape