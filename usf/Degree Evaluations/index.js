const cheerio = require('cheerio'),
    write = require('write-json-file'),
    fs = require('fs'),
    path = require('path'),
    execa = require('execa'),
    obj = {},
    FILE_NAME = './degree-eval.pdf'

function rmbr(line) {
    return line.replace('<br>', '')
}

function loadFile(file) {
    return Promise.resolve(execa.stdout('pdftohtml', ['-stdout', '-q', file]))
}

function scraper(doTheThing) {
    console.log("Transforming data to JSON...")
    return doTheThing().then(text => {
        const searchFor = {
            'Student<br>': (line, i, lines) => {
                const [lastname, firstname, middlename] = rmbr(lines[i + 1]).split(" ")
                obj.firstname = firstname
                obj.middlename = middlename
                obj.lastname = lastname.slice(0, -1)
            },
            'Class<br>': (line, i, lines) => {
                obj.level = rmbr(lines[i + 1])
            },
            'Major<br>': (line, i, lines) => {
                obj.major = rmbr(lines[i + 1])
            },
            'Minor<br>': (line, i, lines) => {
                if (lines[i + 1] !== 'Academic Standing<br>') {
                    obj.minor = rmbr(lines[i + 1])
                }
            },
            'prerequisite<br>': (line, i, lines) => {
                if (lines[i + 1] === 'Catalog Year:<br>') {
                    const required = parseInt(rmbr(lines[i + 4]))
                    const applied = parseInt(rmbr(lines[i + 7]))
                    obj.total_credits_required = required
                    obj.total_credits_applied = applied
                }
            },
            'AREA A: FOUNDATIONS OF COMMUNICATION<br>': (line, i, lines) => {
                const required = parseInt(rmbr(lines[i - 5]))
                const applied = parseInt(rmbr(lines[i - 2]))
                obj.core_credits_required = required
                obj.core_credits_applied = applied
            },
            
        }
        text.split('\n').forEach((line, i, lines) => {
            console.log(i, line)
            if (line in searchFor) {
                searchFor[line](line, i, lines)
            }
        })

        return obj
    }).then(results => write(path.resolve(__dirname, './degree-eval.json'), results).then(() => results)).catch((err) => { console.log("welp something went wrong", err) })
}

if (!module.parent) {
    //scraper(()=>loadFile('./all-classes.html'))
    scraper(() => loadFile(path.resolve(__dirname, FILE_NAME)))
}
module.exports = () => scraper(() => getHTML())
module.exports.scraper = scraper
module.exports.loadFile = () => scraper(() => loadFile(path.resolve(__dirname, FILE_NAME)))