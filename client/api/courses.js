import nano from 'nano'
//is firing a lot?
const { getUser, constants } = require('../api_helpers')
class CoursesController {
    constructor(request) {
        this.request = request
        this.user = getUser(request)
        this.nano = new nano( /*context.isDev*/ true ? 'http://localhost:5984/' : 'http://db.courseselector.com/')
        this.coursesDB = this.nano.use('usf')
    }
    async getAllCourses() {
        const { current_semester } = await this.coursesDB.get('courses')
        const doc = await this.coursesDB.get(current_semester),
            mapDays = {
                M: 'Monday',
                T: 'Tuesday',
                W: 'Wednesday',
                R: 'Thurdsday',
                F: 'Friday',
                S: 'Saturday',
                U: 'Sunday'
            },
            stringify = arr => arr.map(cur => {
                cur.label = cur.map(dayCode => mapDays[dayCode]).join(', ')
                cur.key = cur.join('')
                cur.toString = () => cur.key
                return cur
            }),
            lm = {
                key: 'M',
                label: 'Mountain top'
            },
            av = {
                key: true,
                label: "Available Classes"
            },
            ret = Object.assign({
                filters: [{
                    title: 'Availability',
                    key: 'available',
                    possibles: [av, {
                        key: false,
                        label: "Closed Classes",
                        string: 'All Classes'
                    }],
                    selected: null
                }, {
                    title: 'Campus',
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
                    })),
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
                    title: 'Professors',
                    key: 'instructor',
                    possibles: doc.instructors.filter(a => a.length),
                    selected: null
                }, {
                    title: 'Attributes',
                    key: 'attributes',
                    possibles: doc.attributes.filter(a => a.length),
                    selected: null,
                    every: false
                }],
                current_semester
            }, doc)
        return ret
    }
    async getProfessorData({ params: { professor_name } }) {
        try {
            return await this.coursesDB.get('Proffessor - ' + professor_name)
        } catch (e) {
            return false
        }
    }
}

CoursesController.ROUTES = {
    getAllCourses: {
        path: '/all-courses',
        verb: 'GET'
    },
    getProfessorData: {
        path: '/:professor_name/info',
        verb: 'GET'
    }
}

module.exports = CoursesController