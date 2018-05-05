import PouchDB from 'pouchdb'

const coursesDB = new PouchDB( /*context.isDev*/ true ? 'http://localhost:5984/usf' : 'http://db.courseselector.com/usf')

return coursesDB.get('courses').catch(err => {
    console.error(err)
})