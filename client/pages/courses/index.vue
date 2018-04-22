<template>
    <div>
        <v-layout>
            <v-flex>All courses</v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-card class="flex xs4 md3" v-for="course in course_results" :key="course.CRN+course.Title+course.Instructor">
                <v-card-text>
                    <h3>{{course.Subj}} {{course.Crse}} - {{course.Title}}</h3>
                    <h4>Proffessor: {{course.Instructor}} " {{(course.Days||["UKNOWN"]).join("")}} - {{(course['Date (MM/DD)']||["UNKNOWN"]).join("-")}}</h4>
                    <p>
                        <span v-if="Number(course.Rem)">Spots: {{course.Rem}}</span>
                        <span v-else>Waitlist remaing spots: {{course['WL Rem']}}</span>
                    </p>
                </v-card-text>
            </v-card>
        </v-layout>
    </div>
</template>
<script>
let PouchDB
if (process.browser) {
    PouchDB = require('pouchdb').default
}
export default {
    data() {
            return {
                query: '',
                courses: []
            }
        },
        mounted() {
            const coursesDB = new PouchDB('http://localhost:5984/usf')
            coursesDB.query('courses/latest', {
                limit: 1
            }).then(({
                rows: [{
                    value: doc
                }],
                total_rows
            }) => {
                console.log(doc)
                Object.entries(doc).forEach(([key, value]) => {
                    this[key] = value
                })
            }).catch(err => {
                console.error(err)
            })
        },
        methods: {
            filterBy(course) {
                if (!course.CRN || !course.Instructor) {
                    return false
                }
                return true
            },
            searchWithin(course, str) {
                return Object.values(course).some(val => {
                    if (Array.isArray(val)) {
                        return this.searchWithin(val, str)
                    }
                    if (typeof val === 'string') {
                        return val.includes(str)
                    } else {
                        return searchWithin(val, str)
                    }
                })
            },
        },
        computed: {
            course_results() {
                const query = this.query.trim().toLowerCase()
                console.log(this)
                return this.courses.reduce((arr, course, index) => {
                    if (query.length) {
                        if (this.filterBy(course) && searchWithin(course, query)) {
                            arr.push(course)
                        }
                    } else {
                        if (this.filterBy(course)) {
                            arr.push(course)
                        }
                    }
                    return arr
                }, [])
            }
        }
}
</script>
