export const state = () => ({
    planner: {
        visible: false,
        curTab: '0',
        plan: 0,
        plans: [{
            title: 'My 1st Planner',
            courses: []
        }],
    }
})

export const getters = {
    currentPlan: state => state.planner.plans[state.planner.plan],
    isInCart: state => ({ index }) => getters.currentPlan(state).courses.some(course => course.index === index)
}

export const mutations = {
    addCourse(state, course) {
        console.log('added', course, this.plans)
        getters.currentPlan(state).courses.push(course)
    },
    addPlan(state, plan = { title: 'New Plan', courses: [] }) {
        state.plans.push(plan)
    },
    showPlanner(state) {
        state.planner.visible = true
    },
    hidePlanner(state) {
        state.planner.visible = false
    },
    togglePlanner(state) {
        state.planner.visible = !state.planner.visible
    },
    setPlan(state, index) {
        state.planner.plan = index
    },
    setTab(state,index){
    	state.planner.curTab=index
    }
}

export const actions = {
	async showCourseView({commit}){
		await commit('setTab',0)
		await commit('showPlanner')
	},
	async showCalendarView({commit}){
		await commit('setTab',1)
		await commit('showPlanner')
	},
}