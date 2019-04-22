import ls from 'local-storage'
import { saveAs } from 'file-saver'
import Moment from 'moment'
import {
    extendMoment
} from 'moment-range'


function storeToLocalStorage ({ plans, plan }) {
  ls('plans', plans)
  ls('plan', plan)
}

const DEFAULT_PLANS = [
  {
    title: 'My 1st Planner',
    courses: []
  }
]

export const state = () => ({
  visible: false,
  curTab: 'tab-course',
  plan: 0,
  plans: DEFAULT_PLANS
})

export const getters = {
  plans: state => state.plans,
  currentPlan: state => state.plans[state.plan],
  currentPlanIndex: state => state.plan,
  isInPlan: state => ({ index }) =>
    state.plans[state.plan].courses.some(course => course.index === index),
  indexInPlan: state => ({ index }) => {
    let indexInPlan = -1
    state.plans[state.plan].courses.some((course, i) => {
      indexInPlan = i
      return course.index === index
    })
    return indexInPlan
  },
  plannerIsVisible: state => state.visible
}

export const mutations = {
  addCourse (state, course) {
    console.log('added', course, this.plans)
    getters.currentPlan(state).courses.push(course)
  },
  removeCourseIndex (state, courseIndex) {
    getters.currentPlan(state).courses.splice(courseIndex, 1)
  },
  setPlans (state, plans) {
    state.plans = plans
  },
  addPlan (state, plan = { title: 'New Plan', courses: [] }) {
    state.plans.push(plan)
  },
  removePlan (state, index) {
    state.plans.splice(index, 1)
  },
  showPlanner (state) {
    state.visible = true
  },
  hidePlanner (state) {
    state.visible = false
  },
  togglePlanner (state) {
    state.visible = !state.visible
  },
  setCurPlan (state, index) {
    state.plan = index
  },
  setTab (state, index) {
    state.curTab = index
  },
  setTitle (state, title) {
    getters.currentPlan(state).title = title
  },
  setTitleOf (state, { title, index }) {
    state.plans[index].title = title
  }
}

export const actions = {
    async downloadPlan({ state: { plans } }, { index }) {
        const FileSaver = require('file-saver')
        const moment = extendMoment(Moment)
        const plan_to_download = plans[index]
        const ics = require('ics')
        const day_map = new Map([
            ['M', 'MO'],
            ['T', 'TU'],
            ['W', 'WE'],
            ['R', 'TH'],
            ['F', 'FR'],
            ['S', 'SA'],
            ['U', 'SU']
        ])
        let icsEvents = []

        plan_to_download.courses.forEach(function(plan_course) {
          console.log(plan_course)
          const start_date = plan_course.dates[0]
          const end_date = plan_course.dates[1]
          const start_time = plan_course.times[0]
          const end_time = plan_course.times[1]

          let start_day = Number(start_date.slice(start_date.indexOf('/') + 1))
          let start_hour = Number(start_time.slice(0,2))
          let end_hour = Number(end_time.slice(0,2))
          let start_minute = Number(start_time.slice(3,5))
          let end_minute = Number(end_time.slice(3,5))
          let recurr_string = 'FREQ=WEEKLY;BYDAY='

          if (start_time.slice(-2) == 'pm' && start_hour != 12) {
              start_hour += 12
          }
          if (end_time.slice(-2) == 'pm' && start_hour != 12) {
              end_hour += 12
          }

          console.log('start: ' + start_hour + ':' + start_minute)
          console.log('end: ' + end_hour + ':' + end_minute)

          let duration_minute = 0

          if (start_minute > end_minute) {
            duration_minute = (60 + end_minute) - start_minute
            end_hour--
          } else {
            duration_minute = end_minute - start_minute
          }

          let duration_hour = end_hour - start_hour

          //the time 0:00 is at 5pm the day before for ICS for some reason
          //this is here to correct the actualy 24 hr time for ICS 24 hr time
          if (start_hour > 17) {
              start_hour -= 17
              start_day++
              plan_course.days.forEach(function(day) {
                console.log("special days")
                  switch(day) {
                    case 'M':
                      recurr_string += day_map.get('T')
                      break;
                    case 'T':
                      recurr_string += day_map.get('W')
                      break;
                    case 'W':
                      recurr_string += day_map.get('R')
                      break;
                    case 'R':
                      recurr_string += day_map.get('F')
                      break;
                    case 'F':
                      recurr_string += day_map.get('S')
                      break;
                    case 'S':
                      recurr_string += day_map.get('U')
                      break;
                    case 'U':
                      recurr_string += day_map.get('M')
                      break;
                  }
                  recurr_string += ','
              })  
          } else {
            start_hour += 8
            plan_course.days.forEach(function(day) {
                recurr_string += day_map.get(day) + ','
                console.log("normal days: " + day_map.get(day))
            })
          }

          console.log('start: ' + start_hour + ':' + start_minute)
          console.log('end: ' + end_hour + ':' + end_minute)
          
          recurr_string = recurr_string.slice(0, -1)
          recurr_string += ';INTERVAL=1;UNTIL='
          recurr_string += moment().year() + end_date.slice(0, end_date.indexOf('/')) + end_date.slice(end_date.indexOf('/') + 1)
          recurr_string += 'T070000Z'

          let course_ics_event = {
              title: plan_course.title,
              start: [moment().year(), start_date.slice(0, start_date.indexOf('/')), start_day, start_hour, start_minute],
              duration: { hours: duration_hour, minutes: duration_minute },
              location: plan_course.loc,
              recurrenceRule: recurr_string
          }
          icsEvents.push(course_ics_event)
      })

      const { error, value } = ics.createEvents(icsEvents)

      if (error) {
        console.log('error')
        console.log(error)
        return
      }

      console.log(value)
      // return

      var blob = new Blob([value], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, plan_to_download.title + ".ics");
    },
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
