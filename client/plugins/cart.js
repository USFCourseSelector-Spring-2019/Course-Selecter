import Vue from 'vue'
import PouchDB from 'pouchdb'

export default const Cart={
    install(Vue,options){
        Vue.prototype.$cart=this
        
        Vue.mixin({

        })
    }
}

Vue.use(Cart,{})