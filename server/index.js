const scraper = require('../usf/Courses/'),
    Promise = require('bluebird'),
    mydb = require('nano')('http://localhost:5984')

function store(params) {
    Promise.promisifyAll(mydb);
    const getAndUse = dbName => Promise.promisifyAll(mydb.use(dbName))
    return scraper(params).then(async function (data) {
        const DOC_ID = 'courses - ' + data.semester
        data._id = DOC_ID
        const usf = getAndUse('usf')
        try {
            const doc = await usf.getAsync(DOC_ID)
            data._rev = doc._rev
        } catch (err) {
            console.log('New Semester Document')
        }
        const body = await usf.insertAsync({ ...data })
        console.log(body)
        //successfully put semester Document in

        const courses = {
            current_semester: DOC_ID,
            accessDate: data.accessDate,
            semesters_available: [DOC_ID]
        }
        try {
            const coursesDoc = await use.getAsync('courses')
            Object.assign(courses, coursesDoc)
            courses.semesters_available.push(DOC_ID)
        } catch (err) {
            console.log('New Courses Document')
            courses._id = "courses"
        }
        const coursesBody = usf.insertAsync({ ...courses })
        console.log(coursesBody)
        console.log('Successfully put all USF Data!')
        return DOC_ID
    })
}

if(!module.parent){
    store()
}

module.exports = store