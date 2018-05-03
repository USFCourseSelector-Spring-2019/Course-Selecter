const readJson = require('load-json-file'),
    path = require('path'),
    write = require('write-json-file'),
    cheerio = require('cheerio'),
    readFile = require('fs-readfile-promise')
let base = "https://www.usfca.edu"

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}
String.prototype.trimSplitLines = function () {
    return this.trim().split("\n").map(str => str.trim())
}
String.prototype.trimLines = function () {
    return this.trimSplitLines().join("")
}

function transformExtras(key, val) {

    return [key, val]
}

function scrapeProfessor(data, link) {
    console.log('Starting to scrape:', link)
    return data.then(html => cheerio.load(html)).then($ => {
        const instructor = $('header.profile_detail_tile_header > .profile_detail_tile_name').text().trimLines().split(" ").filter(a => a.length).join(" "),
            positions = $('header.profile_detail_tile_header > .profile_detail_tile_position').text().trim().split(",").map(a => a.trim()),
            titles = $('profile_detail_tile_title').text().trim().split("•").map(a => a.trim()),
            images = uniq_fast(Array.from($('source')).map(source => $(source).attr('srcset'))),
            email = $('.profile_detail_tile_contact.email').text().trim(),
            location = $('.profile_detail_tile_contact.location').text().trim(),
            phone = $('.profile_detail_tile_contact.phone').text().trim(),
            bio = $('.typography > .field').text().trimSplitLines(),
            courses = Array.from($('.view-course-teacher-list .view-content a')).map(node => ({ link: base + $(node).attr('href'), course: $(node).find('span div').text().split(": ")[0], type: $(node).find('span div').text().split(": ")[1] })),
            extras = Array.from($('.definition_listing')).reduce((obj, extraNode) => {
                const oldKey = $(extraNode).find('.definition_term').text().trim()
                const oldValue = Array.from($(extraNode).find('.definition_description')).map(descriptNode => $(descriptNode).text())
                const [key, value] = transformExtras(oldKey, oldValue)
                if (key) {
                    obj[key] = value
                }
                return obj
            }, {})
        console.log("Scraped:",link,' Successfully!')
        //images: biggest first smallest last
        return { instructor, images, email, phone, location,bio, courses, extras, link }

    })
}

if (!module.parent) {
    const nursing = readJson(path.resolve(__dirname, './resp.json')).then(json => json.slice(-2, -1)[0].data)
    artsAndSciences = readFile(path.resolve(__dirname, './proffessors-arts-sciences.html'))
    scrapeProfessor(artsAndSciences).then(proffessors => write(path.resolve(__dirname, './proffessors.json'), proffessors))

    /*write(path.resolve(__dirname,'./proffessors-nursing.html'),html).then(()=>{
        console.log('wrote')
    })*/

}
module.exports = scrapeProfessor