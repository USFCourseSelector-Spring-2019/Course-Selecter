import Vue from 'vue'
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

Vue.use(Vuetify, {
    components: {
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
    },
    theme: {
        primary: '#00543C',
        secondary: '#fcba30'
    }
})