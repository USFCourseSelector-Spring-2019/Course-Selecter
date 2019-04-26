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
    const ics_day_list = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    const semester_year = (plan_to_download.courses[0].dates[0].slice(0, 2) < moment().month()) ? moment().year() + 1 : moment().year()

    //required iCalendar info
    let calendar_string = 'BEGIN:VCALENDAR\nPRODID:-//Nick and Pedram, Squaaaad//Course Calendar//EN\nVERSION:2.0\nCALSCALE:GREGORIAN'
    calendar_string += '\nMETHOD:PUBLISH\nX-WR-CALNAME:' + plan_to_download.title
    //timezone and daylight savings info
    calendar_string += '\nX-WR-TIMEZONE:America/Los_Angeles\nBEGIN:VTIMEZONE\nTZID:America/Los_Angeles'
    calendar_string += '\nX-LIC-LOCATION:America/Los_Angeles\nBEGIN:DAYLIGHT\nTZOFFSETFROM:-0800\nTZOFFSETTO:-0700\nTZNAME:PDT'
    calendar_string += '\nDTSTART:19700308T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:-0700'
    calendar_string += '\nTZOFFSETTO:-0800\nTZNAME:PST\nDTSTART:19701101T020000\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\nEND:STANDARD'
    calendar_string += '\nEND:VTIMEZONE\n'

    plan_to_download.courses.forEach(function(plan_course) {
      //need to use moments to deal with the bug with the start day of the semester not being first day of the course
      //start_moment = the starting date of the course and time the course starts each day
      let start_moment = moment(plan_course.dates[0] + '/' + semester_year)
      //end_moment = the ending date of the course along with the time this course ends each day
      let end_moment = moment(plan_course.dates[1] + '/' + semester_year)

      start_moment.hour(Number(plan_course.times[0].slice(0,2)))
      start_moment.minute(Number(plan_course.times[0].slice(3,5)))
      end_moment.hour(Number(plan_course.times[1].slice(0,2)))
      end_moment.minute(Number(plan_course.times[1].slice(3,5)))

      //adjust for 24 hr time
      if (plan_course.times[0].slice(-2) == 'pm' && start_moment.hours() != 12) {
        start_moment.add(12, 'hours')
      }
      if (plan_course.times[1].slice(-2) == 'pm' && end_moment.hours() != 12) {
        end_moment.add(12, 'hours')
      }

      //create an array that maps the days proveded by banner to the days needed by ICS standard
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

      //there is an issue with the first day of the semester being later than when the first day of this class is
      //in this case we increment the start date to match the first actual class and not the start of the semester
      while(!course_dows.includes(start_moment.day())) {
        start_moment.add(1, 'day')
      }

      let right_now = (moment().year()).toString() //used to show when this was made in correct ICS
      right_now += ((moment().month() + 1).toString().length == 2) ? moment().month() + 1 : '0' + (moment().month() + 1)
      right_now += (moment().date().toString().length == 2) ? moment().date() : '0' + moment().date()
      right_now += 'T'
      right_now += (moment().hours().toString().length == 2) ? moment().hours() : '0' + moment().hours()
      right_now += (moment().minutes().toString().length == 2) ? moment().minutes() : '0' + moment().minutes()
      right_now += '00Z'

      //set up timezone info for this event
      calendar_string += 'BEGIN:VEVENT\nDTSTART;TZID=America/Los_Angeles:'
      calendar_string += start_moment.year()
      calendar_string += ((start_moment.month() + 1).toString().length == 2) ? start_moment.month() + 1 : '0' + (start_moment.month() + 1)
      calendar_string += (start_moment.date().toString().length == 2) ? start_moment.date() : '0' + start_moment.date()
      calendar_string += 'T'
      calendar_string += (start_moment.hours().toString().length == 2) ? start_moment.hours() : '0' + start_moment.hours()
      calendar_string += (start_moment.minutes().toString().length == 2) ? start_moment.minutes() : '0' + start_moment.minutes()
      calendar_string += '00'
      calendar_string += '\nDTEND;TZID=America/Los_Angeles:'
      calendar_string += start_moment.year()
      calendar_string += ((start_moment.month() + 1).toString().length == 2) ? start_moment.month() + 1 : '0' + (start_moment.month() + 1)
      calendar_string += (start_moment.date().toString().length == 2) ? start_moment.date() : '0' + start_moment.date()
      calendar_string += 'T'
      calendar_string += (end_moment.hours().toString().length == 2) ? end_moment.hours() : '0' + end_moment.hours()
      calendar_string += (end_moment.minutes().toString().length == 2) ? end_moment.minutes() : '0' + end_moment.minutes()
      calendar_string += '00'
      calendar_string += '\nRRULE:FREQ=WEEKLY;WKST=SU;UNTIL='
      calendar_string += end_moment.year() 
      calendar_string += ((end_moment.month() + 1).toString().length == 2) ? end_moment.month() + 1 : '0' + (end_moment.month() + 1)
      calendar_string += (end_moment.date().toString().length == 2) ? end_moment.date() : '0' + end_moment.date()
      calendar_string += 'T105959Z;BYDAY='
      course_dows.forEach(function(dow) {
        calendar_string += ics_day_list[dow] + ','
      })
      calendar_string = calendar_string.slice(0, -1)
      calendar_string += '\nDTSTAMP:' + right_now + '\nUID:' + plan_course.title + '@usf.nickthesick.com\nCREATED:' + right_now
      calendar_string += '\nLAST-MODIFIED:' + right_now + '\nLOCATION:' + plan_course.loc + '\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:'
      calendar_string += plan_course.title + '\nEND:VEVENT\n'
    })
    calendar_string += 'END:VCALENDAR\n'

    var blob = new Blob([calendar_string], {type: "text/plain;charset=utf-8"});
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
