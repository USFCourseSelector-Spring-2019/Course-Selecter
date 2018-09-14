const scraper = require('../usf/Proffessors/scrape-browser'),
    Promise = require('bluebird'),
    mydb = require('nano')('http://localhost:5984')

function store() {
    Promise.promisifyAll(mydb);
    const getAndUse = dbName => Promise.promisifyAll(mydb.use(dbName))
    return scraper().then(professors => {
        const usf = getAndUse('usf'),
            names = professors.map(p => p.instructor),
            documents = professors.map((professor, i) => {
                professor._id = "Proffessor - " + professor.instructor
                if (names.slice(0, i).includes(professor.instructor)) {
                    return false
                }
                return professor
            }).filter(a => a)
        return usf.bulkAsync({ docs: documents }).then((body) => {
            console.log(body)
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
