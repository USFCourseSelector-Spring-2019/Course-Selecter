import FileSaver from 'file-saver'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)
const ICS_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
const MAP_TO_ICS = {
  U: 0,
  M: 1,
  T: 2,
  W: 3,
  R: 4,
  F: 5,
  S: 6
}

const calendarGenerator = ({ title }, courseEvents) => `BEGIN:VCALENDAR
PRODID:-//Nick and Pedram, Squaaaad//Course Calendar//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${title}
X-WR-TIMEZONE:America/Los_Angeles
BEGIN:VTIMEZONE
TZID:America/Los_Angeles
X-LIC-LOCATION:America/Los_Angeles
BEGIN:DAYLIGHT
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
TZNAME:PDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
TZNAME:PST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
${courseEvents}END:VCALENDAR
`
const courseCalendarGenerator = ({course, startDate, endDate, courseDays, currentTimeStamp}) => `BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:${startDate.format('YYYYMMDDTHHmm00')}
DTEND;TZID=America/Los_Angeles:${startDate.format('YYYYMMDD')}T${endDate.format('HHmm00')}
RRULE:FREQ=WEEKLY;WKST=SU;\
UNTIL=${endDate.format('YYYYMMDD')}T105959Z;BYDAY=${courseDays.map(dow => ICS_DAYS[dow]).join(',')}
DTSTAMP:${currentTimeStamp}
UID:${course.title}@courseselector.app
CREATED:${currentTimeStamp}
LAST-MODIFIED:${currentTimeStamp}
LOCATION:${course.loc}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${course.title}
CATEGORIES:SCHOOL,CLASS
END:VEVENT
`

const transformCourses = (courses, currentTimeStamp, year) =>
  courses.reduce((acc, {
    dates: [
      startDateString,
      endDateString
    ],
    times: [
      startTime,
      endTime
    ],
    days,
    ...course
  }) => {
    // startDate = the starting date of the course and time the course starts each day
    const startDate = moment(`${startDateString}-${year}-${startTime}`, 'MM-DD-YYYY-hh:mm a')
    // endDate = the ending date of the course along with the time this course ends each day
    const endDate = moment(`${endDateString}-${year}-${endTime}`, 'MM-DD-YYYY-hh:mm a')
    const courseDays = days.map(day => MAP_TO_ICS[day])

    // there is an issue with the first day of the semester being later than when the first day of this class is
    while (!courseDays.includes(startDate.day())) {
      startDate.add(1, 'day')
    }

    return `${courseCalendarGenerator({course, startDate, endDate, courseDays, currentTimeStamp})}${acc}`
  }, '')

export const downloadCalendar = ({ plan: { courses, ...plan } }) => {
  const now = moment()
  const firstCourseEndDate = parseInt(courses[0].dates[1].slice(0, 2), 10)
  // determines if the semester is in this year or in the next one by using the end date, will fail if you're dealing with previous years
  const year = now.year() + (firstCourseEndDate < now.month() ? 1 : 0)
  // current time as a timestamp
  const currentTimeStamp = now.format('YYYYMMDDTHHmm00[Z]')
  const courseEvents = transformCourses(courses, currentTimeStamp, year)
  const calendar = calendarGenerator(plan, courseEvents)
  try {
    const blob = new Blob([calendar], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, plan.title + '.ics')
  } catch (err) {
    return false
  }
  return true
}
