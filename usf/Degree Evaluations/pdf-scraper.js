const cheerio = require('cheerio'),
    write = require('write-json-file'),
    fs = require('fs'),
    path = require('path'),
    execa = require('execa'),
    FILE_NAME = './bensu-degree-eval.pdf',
    {toCourseNames, rmbr} = require('./shared')



function loadFile(file) {
    return Promise.resolve(execa.stdout('pdftohtml', ['-stdout', '-q', file]))
}



function scraper(doTheThing) {
    console.log("Transforming data to JSON...")
    return doTheThing().then(text => {
        const core_attributes = [
                'C-A1 Public Speaking',
                'C-A2 Rhetoric and Composition (Min C-)',
                'C-B1 Math or Quantitative Science',
                'C-B2 Applied or Laboratory Science',
                'C-C1 Literature',
                'C-C2 History',
                'C-D1 Philosophy',
                'C-D2 Theology',
                'C-D3 Ethics',
                'C-E AREA E: SOCIAL SCIENCES',
                'C-F AREA F: VISUAL AND PERFORMING ARTS',
                'Service Learning',
                'Cultural Diversity',
                'Foreign Language Requirement',
                'Complete one of the following:'
            ],
            obj = {
                missing_attributes: [],
                major_missing_reqs: [],
                minor_missing_reqs: [],
                minor: false
            },
            isStillNeeded = line => rmbr(line) === 'Still Needed:',
            major_minor_reqs = type => (line, i, lines) => {
                if (isStillNeeded(lines[i + 1])) {
                    const section_title = rmbr(lines[i + 2]).slice(4, -8)
                    //console.log(`${section_title}`)
                    obj[type === 'Major' ? 'major_title' : 'minor_title'] = section_title

                    searchFor[`${section_title}`] = (line, i, lines) => {
                        obj[`${type==='Major'?'major':'minor'}_credits_required`] = parseInt(rmbr(lines[i - 1]))
                        obj[`${type==='Major'?'major':'minor'}_credits_applied`] = parseInt(rmbr(lines[i + 4]))
                        return type
                    }

                }
            },
            searchFor = {
                'Student': (line, i, lines) => {
                    const [lastname, firstname, middlename] = rmbr(lines[i + 1]).split(" ")
                    obj.firstname = firstname
                    obj.middlename = middlename
                    obj.lastname = lastname.slice(0, -1)
                },
                'Class': (line, i, lines) => {
                    obj.level = rmbr(lines[i + 1])
                },
                'Major': (line, i, lines) => {
                    obj.major = rmbr(lines[i + 1])
                },
                'Minor': (line, i, lines) => {
                    if (lines[i + 1] !== 'Academic Standing<br>') {
                        obj.minor = rmbr(lines[i + 1])
                    }
                },
                'prerequisite': (line, i, lines) => {
                    if (lines[i + 1] === 'Catalog Year:<br>') {
                        const required = parseInt(rmbr(lines[i + 4]))
                        const applied = parseInt(rmbr(lines[i + 7]))
                        obj.total_credits_required = required
                        obj.total_credits_applied = applied
                    }
                },
                'AREA A: FOUNDATIONS OF COMMUNICATION': (line, i, lines) => {
                    const required = parseInt(rmbr(lines[i - 5]))
                    const applied = parseInt(rmbr(lines[i - 2]))
                    obj.core_credits_required = required
                    obj.core_credits_applied = applied


                },
                'Major Requirements': major_minor_reqs('Major'),
                'Minor Requirements': major_minor_reqs('Minor'),
            }
        core_attributes.forEach(attribute => {
            searchFor[attribute] = (line, i, lines) => {
                const courseThatSatifiesRequirement = lines[i + 1]
                if (isStillNeeded(courseThatSatifiesRequirement)) {
                    const missingAttribute = rmbr(attribute)
                    if (!obj.missing_attributes.includes(missingAttribute)) {
                        obj.missing_attributes.push(missingAttribute)
                    }
                }
            }
        })
        const lines = text.split('\n')
        let startAt = -1,
            choosingNumberOf = false;
        for (let i = 0; i < lines.length; i++) {
            const line = rmbr(lines[i]),
                type_of_missing_reqs = `${startAt==='Major'?'major':'minor'}_missing_reqs`

            console.log(i, line)
            if (startAt === -1 || line === 'Major Requirements' || line === 'Minor Requirements') {
                if (line in searchFor) {
                    const shouldBreakAt = searchFor[line](line, i, lines)
                    if (shouldBreakAt) {
                        startAt = shouldBreakAt
                        console.log("BROKE AT:", shouldBreakAt)
                    }
                }
            } else {
                if (isStillNeeded(line)) {
                    const classNeeeded = rmbr(lines[i + 1])
                    if (choosingNumberOf) {
                        const classesToChooseFrom = obj[type_of_missing_reqs].slice(-1)[0].classes

                        classesToChooseFrom.push.apply(classesToChooseFrom, toCourseNames(classNeeeded, i, lines))

                        if (!classNeeeded.endsWith("or")) {
                            choosingNumberOf = false
                        }
                    } else {
                        if (/Choose from ([\d]+) of the following:/.test(classNeeeded)) {
                            const [whole, numberOf] = /Choose from ([\d]+) of the following:/.exec(classNeeeded)
                            choosingNumberOf = parseInt(numberOf)
                            obj[type_of_missing_reqs].push({
                                classes: [],
                                choose: choosingNumberOf
                            })
                        } else {
                            obj[type_of_missing_reqs].push({
                                classes: toCourseNames(classNeeeded, i, lines),
                                choose: 1
                            })
                        }
                    }
                }
            }
        }

        return obj
    }).then(results => write(path.resolve(__dirname, './degree-eval.json'), results).then(() => results)).catch((err) => { console.log("welp something went wrong", err) })
}

if (!module.parent) {
    //scraper(()=>loadFile('./all-classes.html'))
    scraper(() => loadFile(path.resolve(__dirname, FILE_NAME)))
}
module.exports = (file) => scraper(() => loadFile(path.resolve(__dirname, file)))
module.exports.scraper = scraper
module.exports.loadFile = () => scraper(() => loadFile(path.resolve(__dirname, FILE_NAME)))