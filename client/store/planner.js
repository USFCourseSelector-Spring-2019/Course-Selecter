import ls from 'local-storage';

function storeToLocalStorage({ plans, plan }) {
    ls('plans', plans)
    ls('plan', plan)
}

const DEFAULT_PLANS = [{
    title: 'My 1st Planner',
    courses: []
}]

export const state = () => ({
    visible: false,
    curTab: 0,
    plan: 0,
    plans: DEFAULT_PLANS,

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
    removeCourseIndex(state, courseIndex){
        getters.currentPlan(state).courses.splice(courseIndex, 1)
    },
    setPlans(state, plans) {
        state.plans = plans
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
    setTitle(state, title) {
        getters.currentPlan(state).title = title
    },
    setTitleOf(state, { title, index }) {
        state.plans[index].title = title
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
    async saveSettings({ state, rootState: { auth: { loggedIn, user } } }, { $api }) {
        //Store these settings to the user in the db and localstorage or just localstorage if not logged in
        if (loggedIn) {
            try {
                console.log($api)
                await $api.auth.savePlans({ body: { plans, plan } })
            } catch (e) {
                console.log('Failed to save plans with error:', e)
            }
        }
        storeToLocalStorage(state)
    },
    async addCourse({ commit, dispatch }, { payload, $api }) {
        await commit('addCourse', payload)
        await dispatch('saveSettings', { $api })
    },
    async removeCourse({ commit, dispatch }, { payload, $api }) {
        await commit('removeCourseIndex', payload)
        await dispatch('saveSettings', { $api })
    },
    async addPlan({ commit, dispatch }, { payload, $api }) {
        await commit('addPlan', payload)
        await dispatch('saveSettings', { $api })
    },
    async setTitleOf({ commit, dispatch }, { payload, $api }) {
        await commit('setTitleOf', payload)
        await dispatch('saveSettings', { $api })
    },
    async setCurPlan({ commit, dispatch }, { payload, $api }) {
        await commit('setCurPlan', payload)
        await dispatch('saveSettings', { $api })
    },
    async removePlan({ commit, dispatch }, { payload, $api }) {
        await commit('removePlan', payload)
        await dispatch('saveSettings', { $api })
    },
    async loadSettings({
        commit,
        rootState: { auth: { loggedIn, user } }
    }, { $api }) {
        const savedPlans = ls('plans'),
            savedPlan = ls('plan')
        if (loggedIn) {
            const { plans, plan } = await $api.auth.getPlans()
            await commit('setPlans', plans || savedPlan || DEFAULT_PLANS)
            await commit('setCurPlan', plan || savedPlan || 0)
        } else {
            const savedPlans = ls('plans')
            await commit('setPlans', savedPlans || DEFAULT_PLANS)
            await commit('setCurPlan', savedPlan || 0)
        }
    }
}