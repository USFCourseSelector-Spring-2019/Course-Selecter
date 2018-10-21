const scraper = require('../usf/Courses/'),
    Promise = require('bluebird'),
    mydb = require('nano')('http://localhost:5984')
function attachUpdate(db){
    db.update = function(obj, key, callback,transform=a=>a) {
     db.get(key, function (error, existing) { 
      if(!error) obj._rev = existing._rev;
      db.insert(transform(obj,existing), key, callback);
     });
    }
    return db
}
async function store(params) {
    Promise.promisifyAll(mydb);
    const getAndUse = dbName => attachUpdate(Promise.promisifyAll(mydb.use(dbName)))
    return scraper(params).then(async function (data) {
        const DOC_ID = 'courses - ' + data.semester
        data._id = DOC_ID
        const usf = getAndUse('usf')
            
        try{
            const body = await usf.update(data,DOC_ID,(err,existing)=>{
                if(err){
                    console.log(err)
                }
            })
            console.log(body)
        }
        catch(e){
            console.log(e)
        }
        //successfully put semester Document in

        const courses = {
            current_semester: DOC_ID,
            accessDate: data.accessDate,
            semesters_available: [DOC_ID],
        }
        try{
            const coursesBody = await usf.update(courses,'courses',(err,existing)=>{
                if(err){
                    console.log(err)
                }
            },(newObj,oldObj)=>{
                if(oldObj){
                    newObj.semesters_available=(oldObj.semesters_available.concat(DOC_ID)).filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
})
                }
                return newObj
            })
            console.log(coursesBody)
            console.log('Successfully put all USF Data!')
        }catch(e){
            console.log(e)
        }
        return DOC_ID
    })
}

if(!module.parent){
    store({offset:1, headless: true})
}

module.exports = store