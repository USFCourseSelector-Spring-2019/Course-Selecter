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
    const day_list = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    const semester_year = (plan_to_download.courses[0].dates[0].slice(0, 2) < moment().month()) ? moment().year() + 1 : moment().year()
    const march_dls = moment(semester_year + '-03-14')
    const nov_dls = moment(semester_year + '-11-07')
    let icsEvents = []

    //this sets up daylight savings
    while(march_dls.day() != 0) {
      march_dls.subtract(1, 'days')
    }
    while(nov_dls.day() != 0) {
      nov_dls.subtract(1, 'days')
    }

    console.log('march_dls',march_dls.month(), march_dls.date())

    plan_to_download.courses.forEach(function(plan_course) {
      console.log(plan_course)

      let start_moment = moment(plan_course.dates[0] + '/' + semester_year)
      let end_moment = moment(plan_course.dates[1] + '/' + semester_year)
      let march_dls_copy = march_dls.clone()
      let nov_dls_copy = nov_dls.clone()

      start_moment.hour(Number(plan_course.times[0].slice(0,2)))
      start_moment.minute(Number(plan_course.times[0].slice(3,5)))
      end_moment.hour(Number(plan_course.times[1].slice(0,2)))
      end_moment.minute(Number(plan_course.times[1].slice(3,5)))

      let recurr_string = 'FREQ=WEEKLY;BYDAY='
      let course_dows = []

      plan_course.days.forEach(function(day) {
        switch(day) {
          case 'M':
          course_dows.push(1)
          break;
          case 'T':
          course_dows.push(2)
          break;
          case 'W':
          course_dows.push(3)
          break;
          case 'R':
          course_dows.push(4)
          break;
          case 'F':
          course_dows.push(5)
          break;
          case 'S':
          course_dows.push(6)
          break;
          case 'U':
          course_dows.push(0)
          break;
        }
      })

      if (plan_course.times[0].slice(-2) == 'pm' && start_moment.hours() != 12) {
        start_moment.add(12, 'hours')
      }
      if (plan_course.times[1].slice(-2) == 'pm' && end_moment.hours() != 12) {
        end_moment.add(12, 'hours')
      }

      let duration_minute = 0
      let duration_hour = 0

      if (start_moment.minutes() > end_moment.minutes()) {
        duration_minute = (60 + end_moment.minutes()) - start_moment.minutes()
        duration_hour = (end_moment.hours() - 1) - start_moment.hours()
      } else {
        duration_minute = end_moment.minutes() - start_moment.minutes()
        duration_hour = end_moment.hours()  - start_moment.hours()
      }

      //there is an issue with the first day of the semester being later than when the first day of this class is
      //in this case we increment the start date to match the first actual class and not the start of the semester
      while(!course_dows.includes(start_moment.day())) {
        start_moment.add(1, 'day')
      }

      //ICS uses UTC time so it is 8 hours ahead of SF time (PST)
      //this is here to correct for the repeat days
      if (start_moment.hours() > 17) {
        course_dows.forEach(function(day_num) {
          if (day_num + 1 > 6) {
            recurr_string += day_list[0] + ','            
          } else {
            recurr_string += day_list[day_num + 1] + ','
          }
        })  
      } else {
        course_dows.forEach(function(day_num) {
          recurr_string += day_list[day_num] + ','
        })
      }

      //we need 2 separate ICS events because daylight savings messes everything up
      if(start_moment < march_dls < end_moment) {
        march_dls_copy.minutes(start_moment.minutes())
        march_dls_copy.hours(start_moment.hours())
        recurr_string = recurr_string.slice(0, -1)
        let dls_recurr_string = recurr_string

        //before daylight savings
        recurr_string += ';INTERVAL=1;UNTIL='
        recurr_string += march_dls.year()
        recurr_string += ((march_dls.month() + 1).toString().length == 2) ? march_dls.month() + 1 : '0' + (march_dls.month() + 1)
        recurr_string += (march_dls.date().toString().length == 2) ? march_dls.date() : '0' + march_dls.date()
        recurr_string += 'T070000Z'
        //don't want to just convert from local to UTC, because it is SF time to UTC
        //before DLS the difference between SF and UTC is 7 hrs
        start_moment.add(8, 'hours')
        let course_ics_event = {
          title: plan_course.title,
          start: [start_moment.year(), start_moment.month() + 1, start_moment.date(), start_moment.hours(), start_moment.minutes()],
          duration: { hours: duration_hour, minutes: duration_minute },
          location: plan_course.loc,
          recurrenceRule: recurr_string
        }
        icsEvents.push(course_ics_event)

        //after daylight savings
        march_dls_copy.add(8, 'hours')
        while(course_dows[0] != march_dls_copy.day()) {
          march_dls_copy.add(1, 'day')
        }

        dls_recurr_string += ';INTERVAL=1;UNTIL='
        dls_recurr_string += end_moment.year() 
        dls_recurr_string += ((end_moment.month() + 1).length == 2) ? end_moment.month() + 1 : '0' + (end_moment.month() + 1)
        dls_recurr_string += (end_moment.date().length == 2) ? end_moment.date() : '0' + end_moment.date()
        dls_recurr_string += 'T070000Z'
        course_ics_event = {
          title: plan_course.title,
          start: [march_dls_copy.year(), parseInt(march_dls_copy.month() + 1), march_dls_copy.date(), march_dls_copy.hours(), march_dls_copy.minutes()],
          duration: { hours: duration_hour, minutes: duration_minute },
          location: plan_course.loc,
          recurrenceRule: dls_recurr_string
        }
        // icsEvents.push(course_ics_event)
      } else if(start_moment < nov_dls < end_moment) {
        recurr_string = recurr_string.slice(0, -1)
        let recurr_string_copy = recurr_string
        recurr_string += ';INTERVAL=1;UNTIL='
        recurr_string += end_moment.year() 
        recurr_string += ((end_moment.month() + 1).length == 2) ? end_moment.month() + 1 : '0' + (end_moment.month() + 1)
        recurr_string += (end_moment.date().length == 2) ? end_moment.date() : '0' + end_moment.date()
        recurr_string += 'T070000Z'

        console.log("hitler was aight")
      }
    })

    const { error, value } = ics.createEvents(icsEvents)

    if (error) {
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
