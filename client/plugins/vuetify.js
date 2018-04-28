import Vue from 'vue'
import PouchDB from 'pouchdb'
import {
    Vuetify,
    VApp,
    VCard,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VExpansionPanel,
    VTextField,
    VSelect,
    VAlert,
    VDataTable,
    VTabs,
    VDialog,
    VSubheader,
    VBottomSheet,
    VTooltip
} from 'vuetify'
export default (context, inject) => {
    if (process.server) {
        const db = new PouchDB( /*context.isDev*/ true ? 'http://localhost:5984/usf' : 'http://db.courseselector.com/usf')
        return db.get('theme').then((theme) => {
            delete theme._rev
            delete theme._id
            Vue.use(Vuetify, {
                components,
                theme
            })
        })
    } else {
        Vue.use(Vuetify, {
            components
        })
    }

}