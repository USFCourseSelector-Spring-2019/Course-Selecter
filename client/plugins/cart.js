import Vue from 'vue'
import {mapGetters} from 'vuex'
import PouchDB from 'pouchdb'
import Moment from 'moment';
import {
    extendMoment
} from 'moment-range';
const moment = extendMoment(Moment);
const Cart = {
    install(Vue, options) {
        Vue.prototype.$utils = this

        Vue.mixin({
            data() {
                return {
                }
            },
            computed: {
                plans(){
                    return this.$store.getters['planner/plans']
                },
                plan() {
                    return this.$store.getters['planner/currentPlan']
                },
                courses(){
                    return this.plan.courses
                }
            },
            methods: {
                showCourses() {
                    this.$store.dispatch('planner/showCourseView')
                },
                showSchedule() {
                    this.$store.dispatch('planner/showCalendarView')
                },
                showPlanner(showCourses) {
                    if(this.$store.state.planner.curTab===2){
                        return this.showCourses()
                    }
                    this.$store.commit('planner/showPlanner')
                },
                hidePlanner(showCourses) {
                    this.$store.commit('planner/hidePlanner')
                },
                togglePlanner(showCourses) {
                    this.$store.commit('planner/togglePlanner')
                },
                addPlan(plan) {
                    this.$store.commit('planner/addPlan',plan)
                },
                switchPlan(planIndex) {
                    if (Number(planIndex) === planIndex) {
                        this.$store.commit('planner/setCurPlan',planIndex)
                    } else {
                        console.error('unhandled switching of plan was supplied:', planIndex)
                    }
                },
                getHighestAndLowestTime(classes) {
                    if (!Array.isArray(classes)) {
                        classes = [classes]
                    }
                    return [
                        moment.min(classes.map(({
                            times: [lowestTime]
                        }) => moment(lowestTime, 'hh:mm a'))),
                        moment.max(classes.map(({
                            times: [lowestTime, highestTime]
                        }) => moment(highestTime, 'hh:mm a')))
                    ]
                },
                conflictsWith(course) {
                    const rangeToTest = moment.range.apply(moment.range, this.getHighestAndLowestTime(course))
                    return this.courses.map(planCourse => {
                        const range = moment.range.apply(moment.range, this.getHighestAndLowestTime(planCourse))

                        return ((rangeToTest.start.within(range) || rangeToTest.end.within(range))) ? planCourse : false
                    }).filter(a => a).map(sametime=>{
                        return course.days.some(day=>sametime.days.includes(day))?sametime:false
                    }).filter(a=>a)
                },
                canAddToPlanner(course) {
                    return !!this.conflictsWith(course).length
                }
            }
        })
    }
}

Vue.use(Cart, {})