const cheerio = require('cheerio'),
    write = require('write-json-file'),
    fs = require('fs'),
    getHTML = require('./scrape-browser'),
    path = require('path')
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

function scraper(doTheThing) {
    return doTheThing().then(html => cheerio.load(html)).then($ => {
        console.log("Transforming data to JSON...")
        const [accessedBy, semester, accessDate] = $('.staticheaders').text().trimSplitLines(),
            headers = $('table.datadisplaytable').find('tr')[1].children.map(node => $(node).text().trimLines()).filter(a => a.length),
            length = headers.length,
            criteria = {
                attributes: [],
                instructors: [],
                titles: [],
                subjects: [],
                campuses: [],
                categories: [],
                count: -1
            }

        function transformVal(val, key, index, row, headers) {
            const currentCat = criteria.categories[criteria.categories.length - 1]
            const currentCourse = currentCat.courses[currentCat.courses.length - 1]
            const transformer = {
                CRN: val => ['crn', val],
                Crse: val => {

                    const subject = row[headers.indexOf('Subj')]
                    if (subject.length) {
                        if (!currentCat.courses.map(cur => cur.id).includes(val) && val.length) {
                            currentCat.courses.push({ id: val, title: '', attributes: [], classes: [] })
                            currentCat.shortcode = subject
                            if (!criteria.subjects.includes(subject)) {
                                criteria.subjects.push(subject)
                            }
                        }
                    }
                    return ['id', val]
                },
                Select: (val) => {
                    return ['available', val !== 'C']
                },
                Title: (val) => {
                    if (!criteria.titles.includes(val) && val.length) {
                        criteria.titles.push(val)
                    }

                    if (currentCourse.title == '') {
                        currentCourse.title = val
                    }
                    return ['title', val]
                },
                Instructor: (val) => {
                    val = val.split(" ").filter(a => a.length && a !== '(P)').join(" ")
                    if (!criteria.instructors.includes(val)) {
                        if (val && val !== "TBA" && val.length) {
                            criteria.instructors.push(val)
                        }
                    }
                    return ['instructor', val]
                },
                Attribute: (val) => {
                    return ['attributes', val.split(" and ").map(attr => {
                        if (!criteria.attributes.includes(attr) && attr.length) {
                            criteria.attributes.push(attr)
                        }
                        if (currentCourse.attributes.length === 0 && attr.length) {
                            currentCourse.attributes.push(attr)
                        }
                        return attr.trim()
                    })]
                },
                Days: (val) => {
                    const arr = [];
                    ["M", "T", "W", "R", "F", "S", "U"].forEach((cur, i) => {
                        if (val.includes(cur)) {
                            arr.push(cur)
                        }
                    })
                    return ['days', arr]
                },
                Time: val => ['times', val.split("-")],
                'Date (MM/DD)': val => ['dates', val.split("-")],
                Subj: val => ['shortcode', val],
                Cred: val => ['credits', val],
                Sec: val => ['section', val],
                Act: val => ['enrolled', Number(val)],
                Rem: val => ['remaining', Number(val)],
                Cap: val => ['capacity', Number(val)],
                Location: val => ['loc', val],
                'WL Rem': val => ['wl_remaining', Number(val)],
                Cmp: val => {
                    if (!criteria.campuses.includes(val)) {
                        criteria.campuses.push(val)
                    }
                    return ['campus', val]
                },
            }
            if (transformer[key]) {
                return transformer[key](val, index)
            }
            return [false, val]
        }


        const courses = Array.from($('table.datadisplaytable').find('tr')).slice(0).reduce((arr, cur, i) => {
            if (i > -1) {
                const row = Array.from($(cur).find('td')).map(node => $(node).text().trimLines())
                const header = Array.from($(cur).find('th'))
                if (header.length == 1) {
                    criteria.categories.push({ subject: $(header[0]).text(), courses: [], shortcode: '' })
                }
                if (row.length) {
                    const currentCat = criteria.categories[criteria.categories.length - 1]
                    const obj = row.reduce((obj, val, i, row) => {
                        const key = headers[i]
                        const [newKey, newVal] = transformVal(val, key, i, row, headers)
                        if (newKey) {
                            obj[newKey] = newVal
                        }
                        return obj
                    }, {})
                    if (!obj.crn || obj.crn === '') {
                        return arr
                    }
                    obj.subject = criteria.categories[criteria.categories.length - 1].subject;
                    obj.index = criteria.count++;
                    currentCat.courses[currentCat.courses.length - 1].classes.push(obj)

                    return arr.concat(obj)
                }
            }
            return arr
        }, [])


        obj = {
            semester,
            accessDate: new Date(accessDate),
            ...criteria,

        }
        console.log("Transformed Successfully!")
        return obj
    })
}

if (!module.parent) {
    //scraper(()=>loadFile('./all-classes.html'))
    scraper(() => loadFile(path.resolve(__dirname, './all-classes.html'))).then(results => write(path.resolve(__dirname, './courses.json'), results).then(() => console.log('Wrote Results to File') || results)).catch((err) => { console.log("welp something went wrong", err) })
}
module.exports = (params) => scraper(() => getHTML(params))
module.exports.scraper = scraper
module.exports.loadFile = () => scraper(() => loadFile(path.resolve(__dirname, './all-classes.html')))