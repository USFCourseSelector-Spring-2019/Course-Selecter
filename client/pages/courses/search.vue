<template>
    <v-layout row>
        <v-flex lg2 md2 sm12 class="px-3 py-3">
            <h1>Search Courses</h1>
            <v-text-field v-model.trim="query" label="Search" append-icon="search" clearable solo class="mb-2"></v-text-field>
            <div class="hidden-sm-and-down">
                <h2 class="title mb-1 mt-3">Filters</h2>
                <template v-for="(filter,i) in filters">
                    <v-select :key="filter.key" :items="filter.possibles" v-model="filter.selected" :label="filter.title" clearable autocomplete color="light-blue" v-if="filter.possibles.length">
                        <template slot="item" slot-scope="data">
                            <v-list-tile-content v-html="data.item.label||data.item"></v-list-tile-content>
                        </template>
                    </v-select>
                    <v-text-field v-model.trim="filter.selected" :label="filter.title" clearable v-else></v-text-field>
                </template>
            </div>
            <v-expansion-panel expand class="hidden-md-and-up">
                <v-expansion-panel-content>
                    <div slot="header">
                        <h2 class="title mb-1">Filters</h2>
                    </div>
                    <v-layout justify-center column>
                        <v-flex xs12>
                            <template v-for="(filter,i) in filters">
                                <v-select :key="filter.key" :items="filter.possibles" v-model="filter.selected" :label="filter.title" clearable autocomplete :open-on-clear="false" color="light-blue">
                                    <template slot="item" slot-scope="data">
                                        <v-list-tile-content v-html="data.item.label||data.item"></v-list-tile-content>
                                    </template>
                                </v-select>
                            </template>
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-flex>
        <v-flex lg10 md10 sm12 class="pa-3">
            <v-layout>
                <v-flex>All Subjects</v-flex>
            </v-layout>
            <v-expansion-panel>
                <v-expansion-panel-content v-for="category in categories_results">
                    <div slot="header" v-text="category.subject" :key="category.shortcode"></div>
                    <v-expansion-panel expand>
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
        </v-flex>
    </v-layout>
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
                categories: [],
                filters: [{
                    title: 'Campus',
                    key: 'campus',
                    possibles: [],
                    selected: null
                }, {
                    title: 'Subject',
                    key: 'shortcode',
                    possibles: [],
                    selected: null
                }, {
                    title: 'Course ID',
                    key: 'id',
                    possibles: [],
                    selected: null
                }]
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
                const campusFilter = this.filters[0]
                const possibles = doc.campuses.filter(a => a.length)
                possibles[0] = {
                    key: 'M',
                    label: 'Mountain top',
                    toString: () => 'Mountain top'
                }
                campusFilter.possibles = possibles
                campusFilter.selected = possibles[0]
                const subjectFilter = this.filters[1]
                subjectFilter.possibles = doc.categories.map(({
                    shortcode,
                    subject
                }) => ({
                    key: shortcode,
                    label: subject,
                    toString: () => subject
                }))

            }).catch(err => {
                console.error(err)
            })
        },
        watch: {
            filters: {
                handler: function([campusFilter, subjectFilter, courseFilter]) {
                    if (subjectFilter.selected !== null) {
                        const possibles = this.categories.find(({
                            shortcode
                        }) => shortcode === subjectFilter.selected.key).courses.map(({
                            id
                        }) => id)
                        if (courseFilter.possibles.toString() !== possibles.toString()) {
                            courseFilter.possibles = possibles
                        }
                        if (!possibles.includes(courseFilter.selected)) {
                            courseFilter.selected = null
                        }
                    } else {
                        if (courseFilter.possibles.length) {
                            courseFilter.possibles = []
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            filtered(category, query) {
                const [campusFilter, subjectFilter, courseFilter] = this.filters
                const filters = this.filters.filter(({
                    selected
                }) => selected !== null)
                const courses = category.courses.map((course, i) => {
                    const classes = course.classes.reduce((arr, classy) => {
                        if (filters.every(({
                                selected,
                                key
                            }) => {
                                if (typeof selected == 'string') {
                                    return classy[key] === selected
                                }
                                return classy[key] === selected.key
                            })) {
                            arr.push(classy)
                        }
                        return arr
                    }, [])
                    return {...course,
                        classes
                    }
                }).filter(course => course.classes.length)
                if (!courses.length) {
                    return false
                }
                return {...category,
                    courses
                }
            },
            searchWithin(course, str) {
                if (!str.length) {
                    return true
                }
                return Object.values(course).some(val => {
                    if (Array.isArray(val)) {
                        return this.searchWithin(val, str)
                    }
                    if (typeof val === 'number') {
                        return val.toString().includes(str)
                    }
                    if (typeof val === 'boolean') {
                        return false
                    }
                    if (typeof val === 'string') {
                        return val.includes(str)
                    } else {
                        return this.searchWithin(val, str)
                    }
                })
            },
        },
        computed: {
            categories_results() {
                const query = this.query.trim().toLowerCase()
                return this.categories.reduce((arr, category, index) => {
                    const resp = this.filtered(category, query)
                    if (resp !== false) {
                        arr.push(resp)
                    }

                    return arr
                }, [])
            }
        }
}
</script>
