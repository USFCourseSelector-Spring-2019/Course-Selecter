import Vue from 'vue'
import PouchDB from 'pouchdb'
import Moment from 'moment';
import {
    extendMoment
} from 'moment-range';
const moment = extendMoment(Moment);
const Cart = {
    plans: [{
        title: 'My 1st Planner',
        courses: []
    }],
    cart: [],
    planner: {
        visible: false,
        curTab: '0',
        plan: 0
    },
    add(course) {
        console.log('added', course, this.plans)
        this.plans[this.planner.plan].courses.push(course)
    },
    addPlan(plan) {
        console.log('add plan', plan)
        this.plans.push(plan)
    },
    isInCart({ index }) {
        return this.plans[this.planner.plan].courses.some(course => course.index === index)
    },
    install(Vue, options) {
        Vue.prototype.$cart = this

        Vue.mixin({
            data() {
                return {
                    cart: Cart.cart,
                    planner: Cart.planner,
                    plans: Cart.plans,
                    courses: Cart.plans[Cart.planner.plan].courses
                }
            },
            computed: {
                plan() {
                    return this.plans[this.planner.plan]
                }
            },
            methods: {
                isInCart(course) {
                    return Cart.isInCart(course)
                },
                showCourses() {
                    this.planner.curTab = '0'
                },
                showSchedule() {
                    this.planner.curTab = '1'
                },
                showPlanner(showCourses) {
                    this.planner.visible = true
                },
                hidePlanner(showCourses) {
                    this.planner.visible = false
                },
                togglePlanner(showCourses) {
                    this.planner.visible = !this.planner.visible
                },
                addPlan(plan) {
                    return Cart.addPlan(plan)
                },
                switchPlan(planIndex) {
                    if (Number(planIndex) === planIndex) {
                        this.planner.plan = planIndex
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
                    return this.plan.courses.map(planCourse => {
                        const range = moment.range.apply(moment.range, this.getHighestAndLowestTime(planCourse))

                        return ((rangeToTest.start.within(range) || rangeToTest.end.within(range))) ? planCourse : false
                    }).filter(a => a)
                },
                canAddToPlanner(course) {
                    return !!this.conflictsWith(course).length
                }
            },
            watch: {
                plans: {
                    deep: true,
                    handler(plans) {
                        this.courses = plans[this.planner.plan].courses
                    }
                }
            }
        })
    }
}

Vue.use(Cart, {})