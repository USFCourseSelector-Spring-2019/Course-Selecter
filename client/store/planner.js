export const state = () => ({
        visible: false,
        curTab: 0,
        plan: 0,
        plans: [{
            title: 'My 1st Planner',
            courses: []
        }],
    
})

export const getters = {
    plans: state => state.plans,
    currentPlan: state => state.plans[state.plan],
    currentPlanIndex: state => state.plan,
    isInPlan: state => ({ index }) => state.plans[state.plan].courses.some(course => course.index === index),
    plannerIsVisible: state => state.visible
}

export const mutations = {
    addCourse(state, course) {
        console.log('added', course, this.plans)
        getters.currentPlan(state).courses.push(course)
    },
    addPlan(state, plan = { title: 'New Plan', courses: [] }) {
        state.plans.push(plan)
    },
    removePlan(state, index) {
        state.plans.splice(index, 1)
    },
    showPlanner(state) {
        state.visible = true
    },
    hidePlanner(state) {
        state.visible = false
    },
    togglePlanner(state) {
        state.visible = !state.visible
    },
    setCurPlan(state, index) {
        state.plan = index
    },
    setTab(state, index) {
        state.curTab = index
    },
    setTitle(state,title){
        getters.currentPlan(state).title=title
    },
    setTitleOf(state,{title,index}){
        state.plans[index].title=title
    }
}

export const actions = {
    async showCourseView({ commit }) {
        await commit('setTab', 0)
        await commit('showPlanner')
    },
    async showCalendarView({ commit }) {
        await commit('setTab', 1)
        await commit('showPlanner')
    },
    async saveSettings({ store }) {
        const { plans, plan } = store.planner
        //Store these settings to the user in the db and localstorage or just localstorage if not logged in
    }
}