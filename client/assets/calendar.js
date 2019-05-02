import FileSaver from 'file-saver'
import Moment from 'moment'
import {
  extendMoment
} from 'moment-range'

export async function downloadCalendar({ plan }) {
	const moment = extendMoment(Moment)
	const ics_day_list = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] //days of the week for ICS standard
	const semester_year = (plan.courses[0].dates[0].slice(0, 2) < moment().month()) ? moment().year() + 1 : moment().year()

	//required iCalendar info
	//calendar_string is an array because what we use to print requires an array
	let calendar_string = ['BEGIN:VCALENDAR\nPRODID:-//Nick and Pedram, Squaaaad//Course Calendar//EN\nVERSION:2.0\nCALSCALE:GREGORIAN']
	calendar_string += '\nMETHOD:PUBLISH\nX-WR-CALNAME:' + plan.title
	//timezone and daylight savings info
	calendar_string += '\nX-WR-TIMEZONE:America/Los_Angeles\nBEGIN:VTIMEZONE\nTZID:America/Los_Angeles'
	calendar_string += '\nX-LIC-LOCATION:America/Los_Angeles\nBEGIN:DAYLIGHT\nTZOFFSETFROM:-0800\nTZOFFSETTO:-0700\nTZNAME:PDT'
	calendar_string += '\nDTSTART:19700308T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:-0700'
	calendar_string += '\nTZOFFSETTO:-0800\nTZNAME:PST\nDTSTART:19701101T020000\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\nEND:STANDARD'
	calendar_string += '\nEND:VTIMEZONE\n'

	plan.courses.forEach(function(plan_course) {
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
		// const course_day_numbers = plan_course.days.map((arr, day) => {
		//     switch (day) {
		//        	case "M":
		//         	return arr.concat(1);
		//        	case "T":
		//         	return arr.concat(2);
		//        	case "W":
		//         	return arr.concat(3);
		//        	case "R":
		//         	return arr.concat(4);
		//        	case "F":
		//         	return arr.concat(5);
		//        	case "S":
		//         	return arr.concat(6);
		//        	case "U":
		//         	return arr.concat(0);
		//        	default:
		//         	return arr;
		//     }
		// });
		let course_day_numbers = []
		plan_course.days.forEach(function(day) {
			switch(day) {
				case 'M':
				course_day_numbers.push(1)
			break;
				case 'T':
				course_day_numbers.push(2)
			break;
				case 'W':
				course_day_numbers.push(3)
			break;
				case 'R':
				course_day_numbers.push(4)
			break;
				case 'F':
				course_day_numbers.push(5)
			break;
				case 'S':
				course_day_numbers.push(6)
			break;
				case 'U':
				course_day_numbers.push(0)
			break;
		}
		})

		//there is an issue with the first day of the semester being later than when the first day of this class is
		while(!course_day_numbers.includes(start_moment.day())) {
		start_moment.add(1, 'day')
		}

		let right_now = (moment().year()).toString() //used to show when this was made in correct ICS format
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
		//set what days this course is on, aka the repititionss
		calendar_string += '\nRRULE:FREQ=WEEKLY;WKST=SU;UNTIL='
		calendar_string += end_moment.year() 
		calendar_string += ((end_moment.month() + 1).toString().length == 2) ? end_moment.month() + 1 : '0' + (end_moment.month() + 1)
		calendar_string += (end_moment.date().toString().length == 2) ? end_moment.date() : '0' + end_moment.date()
		calendar_string += 'T105959Z;BYDAY='
		calendar_string += course_day_numbers.map((dow)=>ics_day_list[dow]).join(',');
		//other event information
		calendar_string += '\nDTSTAMP:' + right_now + '\nUID:' + plan_course.title + '@usf.nickthesick.com\nCREATED:' + right_now
		calendar_string += '\nLAST-MODIFIED:' + right_now + '\nLOCATION:' + plan_course.loc + '\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:'
		calendar_string += plan_course.title + '\nEND:VEVENT\n'
	})
	calendar_string += 'END:VCALENDAR\n'

	console.log(calendar_string)
	// return

	var blob = new Blob([calendar_string], {type: "text/plain;charset=utf-8"});
	FileSaver.saveAs(blob, plan.title + ".ics");
}
