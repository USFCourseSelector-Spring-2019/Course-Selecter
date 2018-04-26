import Vue from 'vue'
import PouchDB from 'pouchdb'
const Cart = {
    plans: [{
        title: 'My first choice',
        courses: []
    }],
    cart: [],
    planner: {
        visible: true,
        curTab: '1',
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