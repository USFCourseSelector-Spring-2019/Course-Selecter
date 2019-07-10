const scraper = require('./usf/Proffessors/scrape-browser'),
    Promise = require('bluebird'),
    mydb = require('nano')(`http://${process.env.DB_URL || 'localhost'}:5984`)
function getLongestNames(name){
  const namesSortedByLength = name.split(' ').sort((a, b)=>b.length-a.length)
  return namesSortedByLength.slice(0,2).join(" ")
}
function store() {
    Promise.promisifyAll(mydb);
    const getAndUse = dbName => Promise.promisifyAll(mydb.use(dbName))
    return scraper().then(professors => {
        const usf = getAndUse('usf'),
            names = professors.map(p => getLongestNames(p.instructor)),
            documents = professors.map((professor, i) => {
                professor._id = "Proffessor - " + names[i]
                if (names.slice(0, i).includes(names[i])) {//no duplicates please
                    return false
                }
                return professor
            }).filter(a => a)
        return usf.bulkAsync({ docs: documents }).then((body) => {
            //console.log(body)
            console.log('Successfully put all USF Data!')
            return body
        }).catch((err) => {
            console.log(err)
        })
    })
}

if(!module.parent){
    store()
}

module.exports = store
