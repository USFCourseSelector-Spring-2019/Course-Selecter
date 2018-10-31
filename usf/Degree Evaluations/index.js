const readJson = require('load-json-file'),
    path = require('path'),
    write = require('write-json-file'),
    cheerio = require('cheerio'),
    readFile = require('fs-readfile-promise');

function scraper(data) {
    return data.then(html => cheerio.load(html)).then($ => {
        const obj = {}
        const [lastname, firstname, middlename] = $('#frmAudit > table.AuditTable > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)').text().split(" ")
        obj.firstname = firstname
        obj.middlename = middlename
        obj.lastname = lastname.slice(0, -1)

        obj.level = $('#frmAudit > table.AuditTable > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2)').text().trim()

        obj.major = $('#frmAudit > table.AuditTable > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(5) > td:nth-child(4)').text().trim() || false
        obj.minor = $('#frmAudit > table.AuditTable > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(7) > td:nth-child(4)').text().trim() || false
        obj.total_credits_required = Number($('#frmAudit > table:nth-child(13) > tbody > tr > td > table > tbody > tr.TableHead > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(4)').text().trim())
        obj.total_credits_applied = Number($('#frmAudit > table:nth-child(13) > tbody > tr > td > table > tbody > tr.TableHead > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(4)').text().trim())
        obj.core_credits_required = Number($('#frmAudit > table:nth-child(18) > tbody > tr > td > table > tbody > tr.TableHead > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(4)').text().trim())
        obj.core_credits_applied = Number($('#frmAudit > table:nth-child(18) > tbody > tr > td > table > tbody > tr.TableHead > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(4)').text().trim())
        obj.major_requirements = $('#frmAudit > table:nth-child(13) > tbody > tr > td > table > tbody > tr:nth-child(7) > td.RuleLabelData > table > tbody > tr > td > table > tbody > tr > td.RuleAdviceData > a > b').text().trim();
        obj.misssing_attributes = [18, 23, 28].map(num => $(`#frmAudit > table:nth-child(${num}) td.RuleAdviceTitleNew`)).reduce((arr, val) => val ? arr.concat(Array.from(val)) : arr, []).map(node=>node.parent.parent.parent.parent.parent.parent.parent.parent.parent.children[1]).map(node => {
            return $('.RuleLabelTitleNeeded',node).text()
        })
        
        console.log(obj)
        return obj
    })
}

if (!module.parent) {
    scraper(readFile(path.resolve(__dirname, 'thing.html'))).then(results => write(path.resolve(__dirname, './degree-eval.json'), results).then(() => results))
}