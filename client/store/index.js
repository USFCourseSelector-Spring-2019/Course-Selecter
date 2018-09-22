export const state = () => ({
    courseData: false
})

export const getters = {
    loadedCourseData: ({ courseData }) => !!courseData,
    courseData: ({ courseData }) => courseData
}

export const mutations = {
    setCourseData(state, courseData) {
        state.courseData = courseData
    }
}

export const actions = {
    async loadCourseData({ commit, dispatch }, { $api }) {
        const courseData = await $api.courses.getAllCourses({
            params: {
                semester: 'current'
            }
        })
        await commit('setCourseData', courseData)
    },
}

export const plugins = [
    store => {}
]