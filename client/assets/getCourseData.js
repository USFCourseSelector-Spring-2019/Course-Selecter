import PouchDB from 'pouchdb'
//is firing a lot?
const coursesDB = new PouchDB( /*context.isDev*/ true ? 'http://localhost:5984/usf' : 'http://db.courseselector.com/usf')

export default function () {


    return coursesDB.get('courses').catch(err => {
        console.error(err)
    })
}
export { coursesDB }