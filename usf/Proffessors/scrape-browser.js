const puppeteer = require('puppeteer'),
pagesToScrape=['https://www.usfca.edu/arts-sciences/faculty','https://www.usfca.edu/law/faculty/full-time','https://www.usfca.edu/law/faculty/visiting','https://www.usfca.edu/law/faculty/adjunct','https://www.usfca.edu/law/faculty/emeriti','https://www.usfca.edu/management/about/faculty/alphabetical-list','https://www.usfca.edu/nursing/about-the-school/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/catholic-educational-leadership/faculty','https://www.usfca.edu/education/educational-technology/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/higher-education-student-affairs/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/human-rights-education/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/international-multicultural-education/faculty','https://www.usfca.edu/education/programs/doctoral-programs/learning-instruction/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/marriage-family-therapy/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/organization-leadership/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/school-counseling/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/special-education/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/teaching/faculty','https://www.usfca.edu/education/programs/masters-credential-programs/tesol/faculty'],
waitForLoad = (page) => new Promise((resolve) => {
    page.on('rquest', (req) => {
        waitForLoad(page)
    })
    page.on('requestfinished', (req) => {
        setTimeout(() => resolve("idle"), 3000)
    })
})

let scrape = async() => {
    const browser = await puppeteer.launch({ headless: false });
    pagesToScrape.map(async(pageToScrape)=>{
        const page = await browser.newPage();
        await page.goto(pageToScrape);
        
    })
    console.log("Scraping with the browser...")
    await page.goto('https://usfcas.usfca.edu/cas/login?service=https%3A%2F%2Faphrodite01.usfca.edu%3A8010%2Fssomanager%2Fc%2FSSB%3Fpkg%3Dhttps%3A%2F%2Fhebe.usfca.edu%2Fprod%2Ftwbkwbis.P_GenMenu%3Fname%3Dbmenu.P_StuMainMnu');
    //console.log(bodyHTML)
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