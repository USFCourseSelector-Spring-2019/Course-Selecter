import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import expander from '@/components/Expander';
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
                return {}
            },
            computed: {
                ...mapGetters('planner', {
                    plans: 'plans',
                    plan: 'currentPlan'
                }),
                courses() {
                    return this.plan.courses
                }
            },
            methods: {
                ...mapActions('planner', {
                    showCourses: 'showCourseView',
                    showSchedule: 'showCalendarView',
                }),
                ...mapMutations('planner', {
                    hidePlanner: 'hidePlanner',
                    togglePlanner: 'togglePlanner',
                }),
                showPlanner(showCourses) {
                    if (this.$store.state.planner.curTab === 2) {
                        return this.showCourses()
                    }
                    this.$store.commit('planner/showPlanner')
                },
                switchPlan(planIndex) {
                    if (Number(planIndex) === planIndex) {
                        this.$store.dispatch('planner/setCurPlan', { $api: this.$api, payload: planIndex })
                    } else {
                        console.error('unhandled switching of plan was supplied:', planIndex)
                    }
                },
                getHighestAndLowestTime(classes) {
                    if (!Array.isArray(classes)) {
                        classes = [classes]
                    }
                    if(!classes.every(({times})=>!!times)){
                        return []
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
                    }).filter(a => a).map(sametime => {
                        return course.days.some(day => sametime.days.includes(day)) ? sametime : false
                    }).filter(a => a)
                },
                canAddToPlanner(course) {
                    return !!this.conflictsWith(course).length
                }
            }
        })
    }
}

Vue.use(Cart, {})
Vue.component('expander', expander)
Vue.directive('focus', {
    // When the bound element is inserted into the DOM...
    inserted: function (el) {
        // Focus the element
        el.focus()
    }
})