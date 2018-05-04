import PouchDB from 'pouchdb'

export default function (proffessorName) {
    const coursesDB = new PouchDB( /*context.isDev*/ true ? 'http://localhost:5984/usf' : 'http://db.courseselector.com/usf')

    return coursesDB.get('Proffessor - ' + proffessorName).then(data => {
        console.log(proffessorName,data)
        return data
    }).catch(err => {
    	return false
    })
}