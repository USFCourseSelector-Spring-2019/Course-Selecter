import PouchDB from 'pouchdb'
const coursesDB = new PouchDB( /*context.isDev*/ true ? 'http://localhost:5984/usf' : 'http://db.courseselector.com/usf'),
cache={}
export default function (proffessorName) {
   	if(proffessorName in cache){
   		return Promise.resolve(cache[proffessorName])
   	}
    return coursesDB.get('Proffessor - ' + proffessorName).then(data => {
        console.log(proffessorName,data)
        cache[proffessorName]=data
        return data
    }).catch(err => {
    	return false
    })
}