const readJson = require('load-json-file'),
    path = require('path'),
    write = require('write-json-file'),
    cheerio = require('cheerio'),
    readFile=require('fs-readfile-promise')
let base="https://www.usfca.edu"

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

function transformCredentials(key, val) {
    if (key == 'education') {
        val = val.split(" | ").map(a => a.trim())
    }
    if (key == 'courses') {
        val = val.split(", ").map(a => a.trim())
    }
    return [key, val]
}
function scrapeLinks(data){
    return data.then(html => cheerio.load(html)).then($ => {
        const proffessors = Array.from($('article')).map((article, i) => {
            if (i > -1) {
                let obj = {}
                /*const instructor = $(article).find('div > header > h2 > a').text().trimLines().split(" ").filter(a => a.length).join(" "),
                    images = uniq_fast(Array.from($(article).find('source')).map(source => $(source).attr('srcset'))),*/
                const link = base+$(article).find('.directory_card_figure_link').attr('href');
                    /*email = $(article).find('.directory_card_contact.email').text().trim(),
                    phone = $(article).find('.directory_card_contact.phone').text().trim(),
                    credentials = Array.from($(article).find('.directory_card_credential_title')).reduce((ret, heading) => {
                        const [key, val] = transformCredentials($(heading).text().toLowerCase().slice(0, -1), $($(heading).parent()).find('.directory_card_credential_data').text().trimLines())
                        if (key !== false) {
                            ret[key] = val
                        }
                        return ret
                    }, {})*/
                //Images: biggest first smallest last
                return link
            }
        })
        console.log(proffessors)

        return proffessors

    })
}

if (!module.parent) {
    const nursing=readJson(path.resolve(__dirname, './resp.json')).then(json => json.slice(-2, -1)[0].data)
    artsAndSciences=readFile(path.resolve(__dirname,'./proffessors-arts-sciences.html'))
    scrapeLinks(artsAndSciences).then(proffessors=>write(path.resolve(__dirname,'./proffessors.json'),proffessors))

    /*write(path.resolve(__dirname,'./proffessors-nursing.html'),html).then(()=>{
    	console.log('wrote')
    })*/

}