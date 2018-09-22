<template>
    <v-layout row wrap style="height:100%">
        <v-flex xl2 sm12 :class="['px-3', 'py-4', 'fixed-xl-and-up' ,'full-width']">
            <h1 class="text-xs-center display-1">Search Courses</h1>
            <v-layout class="my-4" :column="$vuetify.breakpoint.xsOnly">
                <v-text-field v-model.trim="query" label="Search" append-icon="search" @click:append="search" v-on:keyup.enter="search" clearable solo color="primary"></v-text-field>
                <v-btn @click="bottomSheet=true" class="hidden-md-and-up" color="primary">
                    <v-icon left>filter_list</v-icon>Filter By
                </v-btn>
            </v-layout>
            <div class="hidden-sm-and-down" style="height:100%">
                <h2 class="headline mb-1 my-3 text-xs-center">Filter By</h2>
                <v-layout column align-center style="height:65%">
                    <v-flex v-for="(filter,i) in filters" :key="filter.key" :class="{'px-3':$vuetify.breakpoint.lgAndDown}" style="width:100%">
                        <v-autocomplete :items="filter.possibles.map(mapper)" v-model="selected[i]" :label="filter.title" clearable color="primary" item-text="label" :item-value="filter.possibles[0].key?'key':undefined" v-if="filter.possibles.length" hide-details>
                            <template slot="item" slot-scope="data">
                                <v-list-tile-content v-html="data.item.label||data.item"></v-list-tile-content>
                            </template>
                        </v-autocomplete>
                        <v-text-field v-model.trim="selected[i]" :label="filter.title" clearable hide-details v-else></v-text-field>
                    </v-flex>
                </v-layout>
            </div>
        </v-flex>
        <v-flex xl10 offset-xl2 xs12 :class="{'pa-3':$vuetify.breakpoint.mdAndUp,box:true}">
            <h1 class="pl-2 py-2 text-xl-left text-xs-center display-1">{{semester}} Results</h1>
            <Subject v-for="category in categories_results.slice(0, amountToShow)" :key="category.shortcode" v-bind:subject="category" v-on:open-course="openCourse" />
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="1000" :infinite-scroll-immediate-check="false">
            </div>
            <v-layout v-if="!categories_results.length">
                <h2>No Courses found:</h2> You should check your filters
                <v-btn>Clear Filters</v-btn>
            </v-layout>
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
                    <v-flex sm6 xs12 v-for="(filter,i) in filters" :key="filter.key" class="px-4">
                        <v-autocomplete :items="filter.possibles.map(mapper)" v-model="selected[i]" :label="filter.title" clearable color="primary" item-text="label" :item-value="filter.possibles[0].key?'key':undefined" v-if="filter.possibles.length">
                            <template slot="item" slot-scope="data">
                                <v-list-tile-content v-html="data.item.label||data.item"></v-list-tile-content>
                            </template>
                        </v-autocomplete>
                        <v-text-field v-model.trim="selected[i]" :label="filter.title" clearable v-else></v-text-field>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-bottom-sheet>
    </v-layout>
</template>
<script>
import Subject from '@/components/Subject'
import {
    Search
} from 'js-search';

export default {
    auth: false,
    data() {

        return {
            tempQuery: '',
            query: '',
            categories: [],
            filters: [],
            bottomSheet: false,
            amountToShow: 10,
            busy: false,
            selected: [],
            classesIndex: {
                search: () => this.categories
            },
            subjectIndex: {
                search: () => this.categories
            }
        }
    },
    mounted() {
        const subjectIndex = new Search('subject')
        subjectIndex.addIndex('shortcode')
        subjectIndex.addIndex('subject')
        subjectIndex.addIndex(['courses', 'attributes'])
        subjectIndex.addIndex(['courses', 'id'])
        subjectIndex.addIndex(['courses', 'title'])
        subjectIndex.addDocuments(this.categories)

        const classesIndex = new Search('index')
        classesIndex.addIndex('id')
        classesIndex.addIndex('title')
        classesIndex.addIndex('crn')
        classesIndex.addIndex('loc')
        classesIndex.addIndex('shortcode')
        classesIndex.addIndex('subject')
        classesIndex.addIndex('instructor')
        classesIndex.addIndex('campus')
        classesIndex.addIndex(['attributes', '0'])
        classesIndex.addIndex(['attributes', '1'])
        classesIndex.addIndex(['attributes', '2'])
        classesIndex.addIndex(['attributes', '3'])
        classesIndex.addIndex(['attributes', '4'])
        const x = this.categories.reduce((arr, {
            courses,
            ...rest
        }, r) => arr.concat(courses.reduce((arr, {
            classes
        }, c) => (arr.concat(classes.map(course => ({...course,
            r,
            c
        })))), [])), [])
        classesIndex.addDocuments(x)
        this.subjectIndex = subjectIndex
        this.classesIndex = classesIndex
        console.log(this, this.selected)
    },
    async fetch({
        query,
        app: {
            $api
        },
        store,
        router
    }) {

    },
    async asyncData({
        app: {
            $api
        },
        store,
        query
    }) {
        if (!store.getters.loadedCourseData) {
            console.log('loading')
            await store.dispatch('loadCourseData', {
                $api
            })
            console.log('loaded')
        }
        const courseData = await store.getters.courseData
            //load the selected filters
        const selected = [
            'available',
            'campus',
            'subject',
            'course',
            'days',
            'instructor',
            'attributes'
        ].map(key => key === 'available' ? key in query ? Boolean(query[key]) : undefined : key === 'days' ? key in query ? JSON.parse(query[key]) : undefined : query[key] || undefined)
        console.log(query, selected)
        return {
            selected,
            ...courseData,
        }
    },
    watchQuery: [
        'available',
        'campus',
        'subject',
        'course',
        'days',
        'instructor',
        'attributes',
        'crn'
    ],
    watch: {
        selected: {
            handler: function([availableFilter, campusFilter, subjectFilter, courseFilter, dayFilter, profFilter, attrFilter]) {
                this.$router.push({
                    name: 'courses',
                    query: {
                        crn: this.$router.currentRoute.query.crn,
                        ...[
                            ['available', availableFilter],
                            ['campus', campusFilter],
                            ['subject', subjectFilter],
                            ['course', courseFilter],
                            ['days', dayFilter],
                            ['instructor', profFilter],
                            ['attributes', attrFilter]
                        ].reduce((obj, [key, val]) => (val !== undefined && val !== null ? ({...obj,
                            [key]: key === 'days' ? JSON.stringify(val) : val
                        }) : obj), {})
                    }
                })
            },
            deep: true
        }
    },
    methods: {
        mapper(possible) {
            return typeof possible === 'string' ? possible : ({
                ...possible,
                toString: () => possible.label
            })
        },
        loadMore() {
            this.amountToShow += 4
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
        search() {
            this.query = this.tempQuery
        },
        openCourse(crn) {
            console.log('Switching to: ', crn)
            this.$router.push({
                name: 'courses',
                query: {
                    ...this.$router.currentRoute.query,
                    crn
                }
            })
        }
    },
    computed: {
        categories_results() {
            const [availableFilter, campusFilter, subjectFilter, courseFilter, dayFilter, profFilter, attrFilter] = this.selected,
                filter = (course) => {
                    if (availableFilter === Boolean(availableFilter)) {
                        if (course.available !== availableFilter) {
                            return false
                        }
                    }
                    if (campusFilter) {
                        if (course.campus !== campusFilter) {
                            return false
                        }
                    }
                    if (subjectFilter) {
                        if (course.shortcode !== subjectFilter) {
                            return false
                        }
                    }
                    if (courseFilter) {
                        const [full, shortcode, id] = /([A-Z]+)?(?: )?(\d+)?/gi.exec(courseFilter)
                        if (shortcode) {
                            if (course.shortcode.startsWith(shortcode)) {
                                return false
                            }
                        }
                        if (id) {
                            if (!course.id.startsWith(id)) {
                                return false
                            }
                        }
                    }
                    if (dayFilter) {
                        if (!Array.isArray(course.days) || course.days.join() !== dayFilter.join()) {
                            return false
                        }
                    }
                    if (profFilter) {
                        if (course.instructor !== profFilter) {
                            return false
                        }
                    }
                    if (attrFilter) {
                        if (!Array.isArray(course.attributes) || course.attributes.includes(attrFilter)) {
                            return false
                        }
                    }
                    return true
                }, query = (this.query || '').trim().toLowerCase(),
                categories = this.categories,
                searched = this.classesIndex.search(query).reduce((arr, {
                    r,
                    c,
                    ...course
                }) => {
                    if (filter(course)) {
                        if (arr[r]) {
                            if (arr[r].courses[c]) {
                                arr[r].courses[c].classes.push(course)
                            } else {
                                arr[r].courses[c] = {
                                    shortcode: course.shortcode,
                                    subject: course.subject,
                                    attributes: course.attributes,
                                    classes: [course]
                                }
                            }
                        } else {
                            arr[r] = {...categories[r],
                                courses: []
                            }
                            arr[r].courses[c] = {
                                shortcode: course.shortcode,
                                subject: course.subject,
                                classes: [course]
                            }
                        }
                    }
                    return arr
                }, []).filter(a => a)
            return query.length ? searched : (() => this.categories.map(({
                courses,
                ...rest
            }) => ({
                courses: courses.map(({
                    classes,
                    ...other
                }) => ({
                    classes: classes.filter(filter),
                    ...other
                })).filter(({
                    classes
                }) => classes.length),
                ...rest
            })).filter(({
                courses
            }) => courses.length))()
        },
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
