<template>
    <v-layout row wrap>
        <v-flex xl2 md3 sm12 :class="{'px-3':true, 'py-3':true, fixed:$vuetify.breakpoint.mdAndUp}">
            <h1 class="text-xs-center">Search Courses</h1>
            <v-text-field v-model.trim="query" label="Search" append-icon="search" clearable solo class="mb-2"></v-text-field>
            <div class="hidden-sm-and-down">
                <h2 class="title mb-1 my-3">Filters</h2>
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
                    <v-layout justify-center column class="px-4">
                        <v-flex xs12>
                            <template v-for="(filter,i) in filters">
                                <v-select :key="filter.key" :items="filter.possibles" v-model="filter.selected" :label="filter.title" clearable autocomplete color="light-blue" v-if="filter.possibles.length">
                                    <template slot="item" slot-scope="data">
                                        <v-list-tile-content v-html="data.item.label||data.item"></v-list-tile-content>
                                    </template>
                                </v-select>
                                <v-text-field v-model.trim="filter.selected" :label="filter.title" clearable v-else></v-text-field>
                            </template>
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-flex>
        <v-flex xl10 offset-xl2 md9 offset-md3 sm12 offset-sm0 :class="{'pa-3':$vuetify.breakpoint.mdAndUp}">
            <v-layout>
                <h1 class="pl-2">Results</h1>
            </v-layout>
            <Subject v-for="category in categories_results" :key="category.shortcode" v-bind:subject="category" />
        </v-flex>
    </v-layout>
</template>
<script>
import Subject from '../../components/Subject'
let PouchDB
if (process.browser) {
    PouchDB = require('pouchdb').default
}
export default {
    data() {
            const mapDays = {
                M: 'Monday',
                T: 'Tuesday',
                W: 'Wednesday',
                R: 'Thurdsday',
                F: 'Friday',
                S: 'Saturday',
                U: 'Sunday'
            }
            const stringify = arr => arr.map(cur => {
                cur.label = cur.map(dayCode => mapDays[dayCode]).join(', ')
                cur.key = cur.join('')
                cur.toString = () => cur.key
                return cur
            })
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
                                let compareTo;
                                if (!Array.isArray(classy[key])) {
                                    compareTo = [classy[key]]
                                } else {
                                    compareTo = classy[key]
                                }
                                return (Array.isArray(selected) ? selected : compareTo).every((value, i) => {
                                    if (typeof selected == 'string' || selected === null) {
                                        return value === selected
                                    }
                                    if (Array.isArray(selected)) {
                                        return selected.length === compareTo.length && value === compareTo[i]
                                    }
                                    return value === selected.key
                                })

                            }) && this.searchWithin(classy, query)) {
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
                        return val.toLowerCase().includes(str)
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
        },
        components: {
            Subject
        }
}
</script>
<style>
.fixed {
    position: fixed;
}
</style>
