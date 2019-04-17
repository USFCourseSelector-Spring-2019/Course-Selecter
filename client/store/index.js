export const state = () => ({
  courseData: false,
  courseInfo: {}
})

export const getters = {
  loadedCourseData: ({ courseData }) => !!courseData,
  courseData: ({ courseData }) => courseData,
  loadedCourseInfo: ({ courseInfo }) => crn => !!courseInfo[crn],
  courseInfo: ({ courseInfo }) => crn => courseInfo[crn]
}

export const mutations = {
  setCourseData (state, courseData) {
    state.courseData = courseData
  },
  setCourseInfo (state, { crn, payload }) {
    state.courseInfo[crn] = payload
  }
}

export const actions = {
  async loadCourseData ({ commit, dispatch }, { $api, semester = 'current' }) {
    const courseData = await $api.courses.getAllCourses({
      params: {
        semester
      }
    })
    await commit('setCourseData', courseData)
    return courseData
  },
  async loadCourseInfo (
    { commit, dispatch },
    { $api, crn, semester = 'current' }
  ) {
    if (!crn) {
      return
    }
    const courseInfo = await $api.courses.getCourseData({
      params: {
        semester,
        crn
      }
    })
    await commit('setCourseInfo', { crn, payload: courseInfo })
    return courseInfo
  }
}

export const plugins = [store => {}]
