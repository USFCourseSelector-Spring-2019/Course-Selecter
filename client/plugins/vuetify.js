import Vue from 'vue'
import PouchDB from 'pouchdb'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
export default (context, inject) => {
    if (process.server) {
        const db = new PouchDB( /*context.isDev*/ true ? 'http://localhost:5984/usf' : 'http://db.courseselector.com/usf')
        return db.get('theme').then((theme) => {
            delete theme._rev
            delete theme._id
            Vue.use(Vuetify, {
                theme
            })
        })
    } else {
        Vue.use(Vuetify)
    }

}