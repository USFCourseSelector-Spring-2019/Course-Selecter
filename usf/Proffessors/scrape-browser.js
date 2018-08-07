const puppeteer = require('puppeteer'),
    pagesToScrape = ['https://www.usfca.edu/arts-sciences/faculty', 'https://www.usfca.edu/law/faculty/full-time', 'https://www.usfca.edu/law/faculty/visiting', 'https://www.usfca.edu/law/faculty/adjunct', 'https://www.usfca.edu/law/faculty/emeriti', 'https://www.usfca.edu/management/about/faculty/alphabetical-list', 'https://www.usfca.edu/nursing/about-the-school/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/catholic-educational-leadership/faculty', 'https://www.usfca.edu/education/educational-technology/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/higher-education-student-affairs/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/human-rights-education/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/international-multicultural-education/faculty', 'https://www.usfca.edu/education/programs/doctoral-programs/learning-instruction/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/marriage-family-therapy/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/organization-leadership/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/school-counseling/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/special-education/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/teaching/faculty', 'https://www.usfca.edu/education/programs/masters-credential-programs/tesol/faculty'],
    waitForLoad = (page) => new Promise((resolve) => {
        page.on('rquest', (req) => {
            waitForLoad(page)
        })
        page.on('requestfinished', (req) => {
            setTimeout(() => resolve("idle"), 3000)
        })
    }),
    getLinks = require('./parser'),
    scrapeProfesor = require('./scrapeProfessor'),
    write = require('write-json-file'),
    wait = time => (new Promise(resolve => setTimeout(resolve, time))),
    cheerio = require('cheerio'),
    https = require('https');

function getPage(link) {
    return new Promise((resolve, reject) => {
        https.get(link, resp => {
            let data = '';
            resp.on('data', (chunk) => data += chunk);
            resp.on('end', () => resolve(data));
            resp.on('error', reject)
        })
    })
}

let scrape = async() => {
    
    console.log("Scraping with the browser...")
    //handlePage Promise<Promise<Array<Promise<OBJ>>>>
    const AllProfessors = await (Promise.all(pagesToScrape.slice(0).map(async function handlePage(pageToScrape) {
        const page = getPage(pageToScrape);
        //proffesors Promise<Array<Promise<OBJ>>>
        const proffesors = getLinks(page).then(links => links.map(async function(link) {
            try {
                return scrapeProfesor(getPage(link), link)
            } catch (e) {
                return false
            }
        }))

        const linkToNextPage = await Promise.resolve(page.then(html => cheerio.load(html)).then($ => {
            return $('div.panel-pane.pane-views-panes.pane-in-content-faculty-panel-pane-1 > div > div > ul > li.pager-next > a').attr('href')
        }))
        if (linkToNextPage) {
            //const itsProffesors = await (await handlePage(linkToNextPage))
            //itsProffesors Array<Promise<OBJ>>
            return Promise.resolve((await Promise.all(await proffesors)).concat(await (await handlePage("https://www.usfca.edu"+linkToNextPage))))
        }
        return proffesors

    })).then(async(allProffessors) => (await Promise.all(allProffessors.map(proffesors => Promise.all(proffesors)))).reduce((prev, curr) => prev.concat(curr).filter(a => a), [])));
    console.log("Scraped All Successfully!");
    
    return AllProfessors
}
if (!module.parent) {
    scrape().then((value) => {
        write('./allproffessors.json', value); // Success!
    });
}
module.exports = scrape