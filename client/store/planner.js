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
    const day_list = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    const semester_year = (plan_to_download.courses[0].dates[0].slice(0, 2) < moment().month()) ? moment().year() + 1 : moment().year()

    //required iCalendar info
    let calendar_string = 'BEGIN:VCALENDAR\nPRODID:-//Google Inc//Google Calendar 70.9054//EN\nVERSION:2.0\nCALSCALE:GREGORIAN'
    calendar_string += '\nMETHOD:PUBLISH\nX-WR-CALNAME:test' + plan_to_download.title
    //timezone and daylight savings info
    calendar_string += '\nX-WR-TIMEZONE:America/Los_Angeles\nBEGIN:VTIMEZONE\nTZID:America/Los_Angeles'
    calendar_string += '\nX-LIC-LOCATION:America/Los_Angeles\nBEGIN:DAYLIGHT\nTZOFFSETFROM:-0800\nTZOFFSETTO:-0700\nTZNAME:PDT'
    calendar_string += '\nDTSTART:19700308T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:-0700'
    calendar_string += '\nTZOFFSETTO:-0800\nTZNAME:PST\nDTSTART:19701101T020000\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\nEND:STANDARD'
    calendar_string += '\nEND:VTIMEZONE\n'

    plan_to_download.courses.forEach(function(plan_course) {
      console.log(plan_course)
      let start_moment = moment(plan_course.dates[0] + '/' + semester_year)
      let end_moment = moment(plan_course.dates[1] + '/' + semester_year)

      start_moment.hour(Number(plan_course.times[0].slice(0,2)))
      start_moment.minute(Number(plan_course.times[0].slice(3,5)))
      end_moment.hour(Number(plan_course.times[1].slice(0,2)))
      end_moment.minute(Number(plan_course.times[1].slice(3,5)))

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
      calendar_string += ((start_moment.month() + 1).toString().length == 2) ? start_moment.month() : '0' + (start_moment.month() + 1)
      calendar_string += (start_moment.date().toString().length == 2) ? start_moment.date() : '0' + start_moment.date()
      calendar_string += 'T'
      calendar_string += (end_moment.hours().toString().length == 2) ? end_moment.hours() : '0' + end_moment.hours()
      calendar_string += (end_moment.minutes().toString().length == 2) ? end_moment.minutes() : '0' + end_moment.minutes()
      calendar_string += '00'
      calendar_string += '\nRRULE:FREQ=WEEKLY;WKST=SU;UNTIL=20200509T065959Z;BYDAY=MO,WE'
      calendar_string += '\nDTSTAMP:20190425T223640Z\nUID:7q3thetls50ginkogm9qhg0o97@google.com\nCREATED:20190425T223609Z\nDESCRIPTION:'
      calendar_string += '\nLAST-MODIFIED:20190425T223609Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:test course\nTRANSP:OPAQUE'
      calendar_string += '\nEND:VEVENT\n'

      return      

      let recurr_string = 'FREQ=WEEKLY;BYDAY='

      

      

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
    })
    calendar_string += 'END:VCALENDAR\n'

    console.log(calendar_string)

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
