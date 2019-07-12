const axios = require('axios')
const Conf = require('conf')
const app = require('express')()
const scrapeProfessors = require('./proffessors')
const scrapeCourses = require('./index')
const { DB_URL } = process.env
const port = 9000

const config = new Conf();
const options = {
  offset: 1
}

const ranBefore = config.get('ran-before')

if (!ranBefore) {
  // If the server has never been run before let couchdb initialize and run both of the scrapers
  (new Promise(resolve => setTimeout(resolve, 10000)))
    .then(Promise.all([
      axios.put(`http://${DB_URL}:5984/_users`),
      axios.put(`http://${DB_URL}:5984/degree_audits`),
      axios.put(`http://${DB_URL}:5984/usf`),
      axios.put(`http://${DB_URL}:5984/users`)
    ].map(promise => promise.catch(err => {
      if (err.response && err.response.status === 412) {
        return 'database already exists';
      }
      err.message = 'Something went wrong'
      throw err
    })))).then((all) => {
      console.log('Initialized database with required tables\n')
    }).then(() => {
      return scrapeCourses(options).catch((err) => {
        console.error(err)
        console.log('Unable to scrape courses check your username and password, additional output is likely above this.')
      })
    }).then(() => {
      return scrapeProfessors().catch((err) => {
        console.error(err)
        console.log('Unable to scrape proffessors, additional output is likely above this.')
      })
    }).catch(err => {
      console.error('Some error occured when initializing the database\n', err)
    })

  config.set('ran-before', true)
}



app.get('/', (req, res) => res.send('Hello World!'))
app.get('/healthcheck', (req, res) => res.json({ ok: true }))
app.get('/courses', async (req, res) => {
  const startTime = Date.now();
  try {
    const documentId = await scrapeCourses(options)
    const endTime = Date.now();
    return res.json({
      updated: documentId,
      responseTime: startTime - endTime
    })
  } catch (err) {
    const endTime = Date.now();
    return res.error(JSON.stringify({
      error: true,
      name: err.name,
      message: err.message,
      responseTime: startTime - endTime
    }))
  }
})
app.get('/proffessors', async (req, res) => {
  const startTime = Date.now();
  try {
    const documentId = await scrapeProfessors()
    const endTime = Date.now();
    return res.json({
      updated: documentId,
      responseTime: startTime - endTime
    })
  } catch (err) {
    const endTime = Date.now();
    return res.error(JSON.stringify({
      error: true,
      name: err.name,
      message: err.message,
      responseTime: startTime - endTime
    }))
  }
})

app.listen(port, () => console.log(`Server is listening on port ${port}!`))