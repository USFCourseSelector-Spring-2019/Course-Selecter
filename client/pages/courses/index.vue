<template>
    <div>
        <v-layout>
            <v-flex>All Subjects</v-flex>
        </v-layout>
        <v-expansion-panel>
            <v-expansion-panel-content v-for="category in categories">
                <div slot="header" v-text="category.subject" :key="category.shortcode"></div>
                <v-expansion-panel>
                    <v-expansion-panel-content v-for="course in category.courses" :key="course.id" :to="`/courses/${category.shortcode}/${course.id}`">
                        <h3 slot="header">{{category.shortcode}} {{course.id}} - {{course.title}}</h3>
                        <v-layout row wrap>
                            <v-card class="flex xs4 md3" v-for="(classy,i) in course.classes" :key="category.shortcode+course.id+classy.id+i">
                                <v-card-text>
                                    <h3>{{category.shortcode}} {{classy.id}} - {{classy.title}}</h3>
                                    <h4>Proffessor: {{classy.instructor}} " {{(classy.days||["UKNOWN"]).join("")}} - {{(classy.dates||["UNKNOWN"]).join("-")}}</h4>
                                    <p>
                                        <span v-if="Number(classy.remaining)">Spots: {{classy.remaining}}</span>
                                        <span v-else>Waitlist remaing spots: {{classy.wl_remaining}}</span>
                                    </p>
                                </v-card-text>
                            </v-card>
                        </v-layout>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panel-content>
        </v-expansion-panel>
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
                categories: []
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
