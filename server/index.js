const scraper = require('../usf/Courses/index'),
    Promise = require('bluebird'),
    mydb = require('nano')('http://localhost:5984')
    
if (!module.parent) {
    Promise.promisifyAll(mydb);
    const getAndUse = dbName => Promise.promisifyAll(mydb.use(dbName))
    scraper().then(data => {
        data._id = 'courses'
        getAndUse('usf').insertAsync({ ...data }).then((body) => {
            console.log(body)
            console.log('Successfully put all USF Data!')
        }).catch((err) => {
            console.log(err)
        })
    })
}