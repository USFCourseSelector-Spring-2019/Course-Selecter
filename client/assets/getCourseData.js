import PouchDB from 'pouchdb'
//is firing a lot?
const coursesDB = new PouchDB( /*context.isDev*/ true ? 'http://localhost:5984/usf' : 'http://db.courseselector.com/usf')

export default function () {
//Need to change this out with a proper API that's also needed for accounts and sync.
//Allows for optimization of doing the proper hydration transform on the server side
//And less connections as there is no use for puchdb with the data that doesn't change

    return coursesDB.get('courses').catch(err => {
        console.error(err)
    })
}
export { coursesDB }