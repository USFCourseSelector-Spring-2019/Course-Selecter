<template>
    <v-layout row wrap>
        <v-flex xl2 sm12 :class="['px-3', 'py-4', 'fixed-xl-and-up' ,'full-width']">
            <h1 class="text-xs-center display-1">Search Courses</h1>
            <v-layout class="my-4" :column="$vuetify.breakpoint.xsOnly">
                <v-text-field v-model.trim="query" label="Search" append-icon="search" clearable solo color="primary"></v-text-field>
                <v-btn @click="bottomSheet=true" class="hidden-md-and-up" color="primary">
                    <v-icon left>filter_list</v-icon>Filter By
                </v-btn>
            </v-layout>
            <div class="hidden-sm-and-down">
                <h2 class="headline mb-1 my-3 text-xs-center">Filter By</h2>
                <v-layout wrap justify-center>
                    <v-flex xl12 lg3 md4 sm6 v-for="(filter,i) in filters" :key="filter.key" :class="{'px-3':$vuetify.breakpoint.lgAndDown, 'py-3':true}">
                        <v-autocomplete :items="filter.possibles" v-model="filter.selected" :label="filter.title" clearable color="primary" v-if="filter.possibles.length">
                            <template slot="item" slot-scope="data">
                                <v-list-tile-content v-html="data.item.label||data.item"></v-list-tile-content>
                            </template>
                        </v-autocomplete>
                        <v-text-field v-model.trim="filter.selected" :label="filter.title" clearable v-else></v-text-field>
                    </v-flex>
                </v-layout>
            </div>
        </v-flex>
        <v-flex xl10 offset-xl2 xs12 :class="{'pa-3':$vuetify.breakpoint.mdAndUp,box:true}">
            <h1 class="pl-2 text-xl-left text-xs-center display-1">Results</h1>
            <Subject v-for="category in categories_results" :key="category.shortcode" v-bind:subject="category" />
        </v-flex>
        <v-bottom-sheet v-model="bottomSheet">
            <v-card>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="bottomSheet=false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-layout>
                <v-card-text>
                    <h2 class="headline mb-1 mb-3 text-xs-center">Filter By</h2>
                </v-card-text>
                <v-layout justify-center row wrap>
                    <v-flex sm6 xs12 v-for="(filter,i) in filters" :key="i" class="px-4">
                        <v-autocomplete :key="filter.key" :items="filter.possibles" v-model="filter.selected" :label="filter.title" clearable color="light-blue" v-if="filter.possibles.length">
                            <template slot="item" slot-scope="data">
                                <v-list-tile-content v-html="data.item.label||data.item"></v-list-tile-content>
                            </template>
                        </v-autocomplete>
                        <v-text-field v-model.trim="filter.selected" :label="filter.title" clearable v-else></v-text-field>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-bottom-sheet>
    </v-layout>
</template>
<script>
import Subject from '@/components/Subject'
import getCourseData, {
    coursesDB
} from '@/assets/getCourseData'
const hydrate = doc => {
    const mapDays = {
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
            label: 'Mountain top',
            toString: () => 'Mountain top'
        },
        av = {
            key: true,
            label: "Available Classes",
            toString: () => 'Available Classes'
        },
        ret = Object.assign({
            filters: [{
                title: 'Availability',
                key: 'available',
                possibles: [av, {
                    key: false,
                    label: "Closed Classes",
                    toString: () => 'All Classes'
                }],
                selected: av
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
                    label: subject,
                    toString: () => subject
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
            }]
        }, doc)
    return ret
}
export default {
    data() {
            return {
                query: '',
                categories: [],
                filters: [],
                bottomSheet: false
            }
        },
        created() {
            const {
                campuses,
                instructors,
                categories,
                attributes
            } = this
            const obj = hydrate({
                campuses,
                instructors,
                categories,
                attributes
            })

            coursesDB.changes({
                since: 'now',
                live: true
            }, doc => {
                console.log(doc)
                Object.entries(doc).forEach(([key, value]) => this[key] = value)
            })
            this.filters = obj.filters
        },
        asyncData(context) {

            return getCourseData()
        },
        watch: {
            filters: {
                handler: function([availableFilter, campusFilter, subjectFilter, courseFilter]) {
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
                const [availableFilter, campusFilter, subjectFilter, courseFilter] = this.filters
                const filters = this.filters.filter(({
                    selected
                }) => selected !== null)

                if (query && (category.subject.toLowerCase().includes(query) || category.shortcode.toLowerCase().includes(query))) {
                    return {
                        ...category
                    }
                }
                const courses = category.courses.map((course, i) => {
                    const classes = course.classes.reduce((arr, classy) => {
                        if (filters.every(({
                                selected,
                                key,
                                every = true
                            }) => {
                                let compareTo, comparator;
                                if (!Array.isArray(classy[key])) {
                                    compareTo = [classy[key]]
                                } else {
                                    compareTo = classy[key]
                                }
                                if (every) {
                                    comparator = 'every'
                                } {
                                    comparator = 'some'
                                }
                                return (Array.isArray(selected) ? selected : compareTo)[comparator]((value, i) => {
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
                const query = (this.query || '').trim().toLowerCase()
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
@media(min-width: 1920px) {
    .fixed-xl-and-up {
        position: fixed;
    }
}

.full-width {
    width: 100%;
}
</style>
