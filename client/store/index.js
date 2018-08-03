export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {}

export const plugins = [
    store => {
        store.subscribe(({ type }) => {
            if (type === 'planner/addCourse' || type === 'planner/addPlan' || type === 'planner/removePlan' || type === 'planner/setCurPlan' || type.startsWith('planner/setTitle')) {
                store.dispatch('planner/saveSettings')
            }
        })
    }
]