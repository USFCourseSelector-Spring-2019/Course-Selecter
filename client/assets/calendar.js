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

const calendarGenerator = ({ title }) => `BEGIN:VCALENDAR
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
`

export const downloadCalendar = ({ plan }) => {
  // determines if the semester is in this year or in the next one by using the end date, will fail if you're dealing with previous years
  const year =
    plan.courses[0].dates[1].slice(0, 2) < moment().month()
      ? moment().year() + 1
      : moment().year()

  // current moment as a timestamp
  const currentTimeStamp = moment().format('YYYYMMDDTHHmm00[Z]')

  // required iCalendar info
  // Using template literal by request of Nick, but if I indent the second line my calendar app doesn't recognize it
  let calendar = calendarGenerator(plan)

  plan.courses.forEach(function (course) {
    // need to use moments to deal with the bug with the start day of the semester not being first day of the course
    // startDate = the starting date of the course and time the course starts each day
    let startDate = moment(
      course.dates[0] + '/' + year,
      'MM-DD-YYYY'
    )
    // endDate = the ending date of the course along with the time this course ends each day
    let endDate = moment(
      course.dates[1] + '/' + year,
      'MM-DD-YYYY'
    )

    startDate.hour(Number(course.times[0].slice(0, 2)))
    startDate.minute(Number(course.times[0].slice(3, 5)))
    endDate.hour(Number(course.times[1].slice(0, 2)))
    endDate.minute(Number(course.times[1].slice(3, 5)))

    // adjust for 24 hr time
    if (course.times[0].slice(-2) == 'pm' && startDate.hours() != 12) {
      startDate.add(12, 'hours')
    }
    if (course.times[1].slice(-2) == 'pm' && endDate.hours() != 12) {
      endDate.add(12, 'hours')
    }

    let courseDays = course.days.map(day => MAP_TO_ICS[day])

    // there is an issue with the first day of the semester being later than when the first day of this class is
    while (!courseDays.includes(startDate.day())) {
      startDate.add(1, 'day')
    }

    // set up timezone info for this event, then add the days this course repeats on, and end it with tags needed for ICS
    calendar += `BEGIN:VEVENT
    DTSTART;TZID=America/Los_Angeles:${startDate.format(
    'YYYYMMDD'
  )}T${startDate.format('HHmm')}00
DTEND;TZID=America/Los_Angeles:${startDate.format(
    'YYYYMMDD'
  )}T${endDate.format('HHmm')}00
RRULE:FREQ=WEEKLY;WKST=SU;\
UNTIL=${endDate.format('YYYYMMDD')}T105959Z;BYDAY=${courseDays.map(dow => ICS_DAYS[dow]).join(',')}
DTSTAMP:${currentTimeStamp}
UID:${course.title}@usf.nickthesick.com
CREATED:${currentTimeStamp}
LAST-MODIFIED:${currentTimeStamp}
LOCATION:${course.loc}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${course.title}
END:VEVENT
`
  })
  calendar += 'END:VCALENDAR'

  try {
    var blob = new Blob([calendar], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, plan.title + '.ics')
  } catch (err) {
    return false
  }
  return true
}
