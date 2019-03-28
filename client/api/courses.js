import nano from 'nano'
//is firing a lot?
const { getUser, constants } = require('../api_helpers')
class CoursesController {
    constructor(request) {
        this.request = request
        this.nano = new nano( /*context.isDev*/ true ? 'http://localhost:5984/' : 'http://db.courseselector.com/')
        this.coursesDB = this.nano.use('usf')
    }
    async getAllCourses({ params: { semester } }) {
        if (!semester || semester === 'current') {
            const courses = await this.coursesDB.get('courses')
            semester = courses.current_semester
        }
        const doc = await this.coursesDB.get(semester),
            mapDays = {
                M: 'Monday',
                T: 'Tuesday',
                W: 'Wednesday',
                R: 'Thurdsday',
                F: 'Friday',
                S: 'Saturday',
                U: 'Sunday'
            },
            stringify = arr => arr.map(cur => ({
                label: cur.map(dayCode => mapDays[dayCode]).join(', '),
                key: cur
            })),
            lm = {
                key: 'M',
                label: 'Mountain top'
            },
            av = {
                key: true,
                label: "Available Classes"
            },
            sc = {
                key: true,
                label: "All courses"
            },
            ret = Object.assign({
                filters: [{
                    title: 'Availability of Class',
                    key: 'available',
                    possibles: [av, {
                        key: false,
                        label: "Closed Classes"
                    }],
                    selected: null
                }, {
                    title: 'Schedule Conflicts',
                    key: 'shedule',
                    possibles: [sc, {
                        key: false,
                        label: "Courses With No Schedule Conflicts"
                    }],
                    selected: null
                }, {
                    title: 'All Campuses',
                    key: 'campus',
                    possibles: [lm, ...doc.campuses.filter(a => a.length).slice(1)],
                    selected: lm
                }, {
                    title: 'Subject',
                    key: 'shortcode',
                    possibles: doc.categories.map(({
                        shortcode,
                        subject
                    }) => ({
                        key: shortcode,
                        label: subject
                    })).sort(({label:a},{label:b})=>a>b),
                    selected: null
                }, {
                    title: 'Course ID',
                    key: 'id',
                    possibles: [],
                    selected: null
                }, {
                    title: 'Days',
                    key: 'days',
                    possibles: stringify([
                        ['M', 'W', 'F'],
                        ['T', 'R'],
                        ['M', 'W'],
                        ['W', 'F'],
                        ['M'],
                        ['T'],
                        ['W'],
                        ['R'],
                        ['F'],
                        ['S', 'U'],
                        ['S'],
                        ['U']
                    ]),
                    selected: null
                }, {
                    title: 'Professor',
                    key: 'instructor',
                    possibles: doc.instructors.filter(a => a.length).sort(),
                    selected: null
                }, {
                    title: 'Attribute',
                    key: 'attributes',
                    possibles: doc.attributes.filter(a => a.length).sort(),
                    selected: null,
                    every: false,
                    hint: 'Search by the requirement the class fufills'
                }],
                semester
            }, doc)
        return ret
    }
    async getCourseData({ params: { semester, crn } }) {
        if (!semester || semester === 'current') {
            const courses = await this.coursesDB.get('courses')
            semester = courses.current_semester
        }
        
        const { categories } = await this.coursesDB.get(semester)
        const course = categories.reduce((response, category) => {
            if (response !== false) {
                return response
            }
            const course = category.courses.reduce((response, { classes }) => response || classes.find(course => course.crn === crn), false)
            return course || response
        }, false)

        if (!course) {
            return false
        }
        const professor_data = await this.getProfessorData({ params: { proffessor_name: course.instructor } })


        //also grab rating shit?

        return { ...course, professor_data }

    }
    async getProfessorData({ params: { professor_name } }) {
        function getLongestNames(name){
  const namesSortedByLength = name.split(' ').sort((a, b)=>b.length-a.length)
  return namesSortedByLength.slice(0,2).join(" ")
}
        try {
            return await this.coursesDB.get('Proffessor - ' + getLongestNames(professor_name))
        } catch (e) {
            return false
        }
    }
}

CoursesController.ROUTES = {
    getAllCourses: {
        path: '/all-courses/:semester',
        verb: 'GET'
    },
    getProfessorData: {
        path: '/info/:professor_name',
        verb: 'GET'
    },
    getCourseData: {
        path: '/data/:semester/:crn',
        verb: 'GET'
    }
}

module.exports = CoursesController