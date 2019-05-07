import FileSaver from 'file-saver'
import Moment from 'moment'
import {
  extendMoment
} from 'moment-range'

export const downloadCalendar = ({ plan }) => {
	const moment = extendMoment(Moment)
	const ics_day_list = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] //days of the week for ICS standard
	//determines if the semester is in this year or in the next one by using the end date, will fail if you're dealing with previous years
	const semester_year = (plan.courses[0].dates[1].slice(0, 2) < moment().month()) ? moment().year() + 1 : moment().year()

	//stores the current moment to be used where ICS needs a timestamp
	const right_now = `${moment().format('YYYYMMDD')}T${moment().format('HHmm')}00Z`

	//required iCalendar info
	//Using template literal by request of Nick, but if I indent the second line my calendar app doesn't recognize it
	let calendar_string = `BEGIN:VCALENDAR\nPRODID:-//Nick and Pedram, Squaaaad//Course Calendar//EN\nVERSION:2.0
CALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:${plan.title}`
	//timezone and daylight savings info
	calendar_string += `\nX-WR-TIMEZONE:America/Los_Angeles\nBEGIN:VTIMEZONE\nTZID:America/Los_Angeles\nX-LIC-LOCATION:America/Los_Angeles
BEGIN:DAYLIGHT\nTZOFFSETFROM:-0800\nTZOFFSETTO:-0700\nTZNAME:PDT\nDTSTART:19700308T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\nEND:DAYLIGHT
BEGIN:STANDARD\nTZOFFSETFROM:-0700\nTZOFFSETTO:-0800\nTZNAME:PST\nDTSTART:19701101T020000\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\nEND:STANDARD
END:VTIMEZONE\n`

	plan.courses.forEach(function(plan_course) {
		//need to use moments to deal with the bug with the start day of the semester not being first day of the course
		//start_moment = the starting date of the course and time the course starts each day
		let start_moment = moment(plan_course.dates[0] + '/' + semester_year, 'MM-DD-YYYY')
		//end_moment = the ending date of the course along with the time this course ends each day
		let end_moment = moment(plan_course.dates[1] + '/' + semester_year, 'MM-DD-YYYY')

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

		let course_day_numbers = plan_course.days.map(day => {
		    switch (day) {
		       	case "M":
		        	return 1
		       	case "T":
		        	return 2
		       	case "W":
		        	return 3
		       	case "R":
		        	return 4
		       	case "F":
		        	return 5
		       	case "S":
		        	return 6
		       	case "U":
		        	return 0
		       	default:
		        	return
		    }
	   	});

		//there is an issue with the first day of the semester being later than when the first day of this class is
		while(!course_day_numbers.includes(start_moment.day())) {
			start_moment.add(1, 'day')
		}

		//set up timezone info for this event, then add the days this course repeats on, and end it with tags needed for ICS
		calendar_string += `BEGIN:VEVENT\nDTSTART;TZID=America/Los_Angeles:${start_moment.format('YYYYMMDD')}T${start_moment.format('HHmm')}00
DTEND;TZID=America/Los_Angeles:${start_moment.format('YYYYMMDD')}T${end_moment.format('HHmm')}00\nRRULE:FREQ=WEEKLY;WKST=SU;\
UNTIL=${end_moment.format('YYYYMMDD')}T105959Z;BYDAY=${course_day_numbers.map((dow)=>ics_day_list[dow]).join(',')}\nDTSTAMP:${right_now}
UID:${plan_course.title}@usf.nickthesick.com\nCREATED:${right_now}\nLAST-MODIFIED:${right_now}\nLOCATION:${plan_course.loc}\nSEQUENCE:0
STATUS:CONFIRMED\nSUMMARY:${plan_course.title}\nEND:VEVENT\n`
	})
	calendar_string += 'END:VCALENDAR\n'

	try {
		var blob = new Blob([calendar_string], {type: "text/plain;charset=utf-8"})
		FileSaver.saveAs(blob, plan.title + ".ics")}
	catch(err) {
		return false
	}
	return true;
}
