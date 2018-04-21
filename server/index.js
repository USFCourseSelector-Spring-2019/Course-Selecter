const scraper = require('../usf/index'),
    Promise = require('bluebird'),
    mydb = require('nano')('http://localhost:5984')

Promise.promisifyAll(mydb);
const getAndUse = dbName => Promise.promisifyAll(mydb.use(dbName))
scraper().then(data => {
    getAndUse('usf').insertAsync({ docs: data }).then((body) => {
        console.log(body)
        console.log('Successfully put all USF Data!')
    }).catch((err) => {
        console.log(err)
    })

    /*Promise.all(Object.entries(data.criteria).map(([key, docs]) => {
        return (new Promise((resolve, reject) => {
            mydb.db.destroy(key, function (err) {
                resolve()
            })
        })).then(() => new Promise(resolve => mydb.db.create(key, () => resolve()))).then(() => {
            return getAndUse(key).bulkAsync({ docs:docs.map(val=>({value:val})) }).then(body => {
                console.log(body)
            })
        })

    })).then(() => {
        console.log('Successfully put criteria')
    }).catch(err => { console.log(err) })*/

})