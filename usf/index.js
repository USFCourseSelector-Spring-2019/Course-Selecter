const cheerio = require('cheerio'),
    write = require('write-json-file'),
    fs = require('fs'),
    getHTML = require('./puppet')
let obj = {}
String.prototype.trimSplitLines = function () {
    return this.trim().split("\n").map(str => str.trim())
}
String.prototype.trimLines = function () {
    return this.trimSplitLines().join("")
}

function loadFile(file) {
    return new Promise((resolve, reject) => fs.readFile(file, function (err, html) {
        if (err) {
            return reject(err)
        }
        resolve(html.toString())
    }))
}

function scraper(doTheThing){
doTheThing().then(html => cheerio.load(html)).then($ => {
    const [accessedBy, semester, accessDate] = $('.staticheaders').text().trimSplitLines(),
        headers = $('table.datadisplaytable').find('tr')[1].children.map(node => $(node).text().trimLines()).filter(a => a.length),
        length = headers.length,
        criteria = {
            attributes: [],
            instructors: [],
            categories: [],
            locations: [],
            titles: [],
            subjects: {}
        }

    function transformVal(val, key, index) {
        const transformer = {
            Select: (val) => {
                return val !== 'C'
            },
            Title: (val) => {
                if (!criteria.titles.includes(val)) {
                    if (val) {
                        criteria.titles.push(val)
                    }
                }
                return val
            },
            Instructor: (val) => {
                if (!criteria.instructors.includes(val)) {
                    if (val) {
                        criteria.instructors.push(val)
                    }
                }
                return val
            },
            Location: (val) => {
                if (!criteria.locations.includes(val)) {
                    if (val) {
                        criteria.locations.push(val)
                    }
                }
                return val
            },
            Attribute: (val) => {
                val.split(" and ").forEach(attr => {
                    if (!criteria.attributes.includes(attr)) {
                        if (attr) {
                            criteria.attributes.push(attr)
                        }
                    }
                })
                return val
            },
            Days: (val) => {
                const arr = [];
                ["M", "T", "W", "R", "F", "S", "U"].forEach((cur, i) => {
                    if (val.includes(cur)) {
                        arr.push(cur)
                    }
                })
                return arr
            },
            Time: val => val.split("-"),
            'Date (MM/DD)': val => val.split("-")
        }
        if (transformer[key]) {
            return transformer[key](val, index)
        }
        return val
    }


    const courses = Array.from($('table.datadisplaytable').find('tr')).slice(0).reduce((arr, cur, i) => {
        if (i > -1) {
            const row = Array.from($(cur).find('td')).map(node => $(node).text().trimLines())
            const header = Array.from($(cur).find('th'))
            if (header.length == 1) {
                criteria.categories.push($(header[0]).text())
            }
            if (row.length) {
                const obj = row.reduce((obj, val, i) => {
                    const key = headers[i]
                    obj[key] = transformVal(val, key, i)
                    return obj
                }, {})
                obj.Category = criteria.categories[criteria.categories.length - 1]
                return arr.concat(obj)
            }
        }
        return arr
    }, [])



    obj = {
        semester,
        accessDate: new Date(accessDate),
        criteria,
        courses,

    }
    //console.log(courses)
    return obj
}).then(results => write('./courses.json', results)).catch((err) => { console.log("welp something went wrong", err) })
}

if(!module.parent){
    //scraper(()=>loadFile('./all-classes.html'))
    scraper(()=>getHTML())
}
module.exports = scraper