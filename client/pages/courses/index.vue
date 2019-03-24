<template>
    <v-layout row wrap style="height:100%">
        <v-flex xl2 sm12 class="px-3 py-4 full-width fixed-xl-and-up">
            <h1 class="text-xs-center display-1">Search Courses</h1>
            <v-layout class="my-4" :column="$vuetify.breakpoint.xsOnly">
                <v-text-field v-model.trim="tempQuery" label="Search" v-on:keyup.enter="search" clearable solo color="primary"></v-text-field>
                <v-btn color="primary" @click="search" large class="my-0">
                    <v-icon left>search</v-icon>
                    <span>Search</span>
                </v-btn>
                <v-btn @click="bottomSheet=true" large flat class="my-0 hidden-md-and-up">
                    <v-icon left>filter_list</v-icon>
                    <span>Filter By</span>
                </v-btn>
            </v-layout>
            <div class="hidden-sm-and-down" style="height:100%">
                <h2 class="headline text-xs-center">Filter By</h2>
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
        <v-flex xl10 offset-xl2 xs12 :class="{'px-3 pb-3':$vuetify.breakpoint.mdAndUp,box:true}">
            <h1 class="pl-2 py-2 text-xl-left text-xs-center display-1" ref="results">All {{semester}} Results</h1>
            <Subject v-for="category in categories_results.slice(0, amountToShow)" :key="category.shortcode" v-bind:subject="category" v-on:open-course="openCourse" />
            <div v-infinite-scroll="loadMore" infinite-scroll-distance="1000" :infinite-scroll-immediate-check="false">
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
        <v-dialog v-model="modal" :fullscreen="this.$vuetify.breakpoint.mdAndDown" :hide-overlay="this.$vuetify.breakpoint.mdAndDown" transition="dialog-bottom-transition" lazy>
            <v-card tile>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click.native="modal= false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{(courseInfo && `${courseInfo.shortcode} ${courseInfo.id}`)||'Loading...'}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn :color="adding?'success':'primary'" @click="inPlanner?showPlanner():addCourse()" :loading="adding" class="primary-fg--text" flat>
                            <v-icon left>{{inPlanner?'view_list':'add'}}</v-icon><span v-text="inPlanner?'Show in Plan':'Add to Plan'"></span>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-layout v-if="loading||!courseInfo" class="full-height" column justify-center align-center>
                    Loading
                    <v-progress-circular :size="100" :width="7" color="primary" indeterminate></v-progress-circular>
                </v-layout>
                <div v-else>
                    <v-layout xl5 lg6 xs12 class="flex px-1" column>
                        <v-alert v-model="!courseInfo.available" class="full-width" color="red darken-4" icon="warning">This is course is not available</v-alert>
                        <v-alert :value="canAddToPlanner(courseInfo) && conflictsWith(courseInfo)[0].index!==courseInfo.index" color="warning grey--text text--darken-4" icon="warning">
                            The course times of this course conflicts with {{conflictsWith(courseInfo).length===1?'this course:':'these courses:'}}
                            <span v-for="(conflict,i) in conflictsWith(courseInfo)" :key="conflict.index">
                                {{i>1?',':' '}}{{conflict.title}} - {{conflict.shortcode}} {{courseInfo.id}} with {{courseInfo.instructor}}
                            </span>
                        </v-alert>
                        <h2 class="headline font-weight-regular py-2">{{courseInfo.title}}</h2>
                        <h3 class="title font-weight-regular py-2">CRN: {{courseInfo.crn}}</h3>
                        <h4 class="subheading font-weight-regular py-2">{{(courseInfo.days||[]).join('')}} {{(courseInfo.times||[]).join(' - ')}}</h4>
                        <v-flex class="my-1"></v-flex>
                        <v-layout row wrap class="no-grow">
                            <v-flex xs3 class="pr-1">
                                <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                    <div class="headline">{{Number(courseInfo.credits).toFixed(0)}}</div>
                                    <span class="subheader">Credits</span>
                                </v-card>
                            </v-flex>
                            <v-flex xs3 class="pr-1">
                                <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                    <div class="headline">{{courseInfo.enrolled}}</div>
                                    <span class="subheader">Enrolled</span>
                                </v-card>
                            </v-flex>
                            <v-flex xs3 class="px-0">
                                <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                    <div class="headline">{{courseInfo.remaining}}</div>
                                    <span class="subheader">Remaining</span>
                                </v-card>
                            </v-flex>
                            <v-flex xs3 class="pl-1">
                                <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                    <div class="headline">{{courseInfo.wl_remaining}}</div>
                                    <span class="subheader">Waitlist</span>
                                </v-card>
                            </v-flex>
                        </v-layout>
                        <h2 class="headline font-weight-regular py-2 mt-2 text-xs-center">{{courseInfo.instructor}}</h2>
                        <a :href="link" target="_blank" class="avatar mx-auto"><img :src="image" class="elevation-1 proffessor-img mt-3" /></a>
                        <p v-text="bio" class="mx-3 mt-4">Proffessor Bio... and Proffessor images</p>
                    </v-layout>
                </div>
            </v-card>
        </v-dialog>
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
            loading: false,
            crn: undefined,
            selected: [],
            courseInfo: {},
            adding: false,
            professor: false,
        }
    },
    mounted() {

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
            await store.dispatch('loadCourseData', {
                $api
            })
        }
        const courseData = await store.getters.courseData
            //load the selected filters
        const selected = [
            'time',
            'available',
            'campus',
            'subject',
            'course',
            'days',
            'instructor',
            'attributes'
        ].map(key => key === 'available' ? key in query ? Boolean(query[key]) : undefined : key === 'days' ? key in query ? JSON.parse(query[key]) : undefined : query[key] || undefined)
        let courseInfo = {}
        let professor = false
        if (!store.getters.loadedCourseInfo(query.crn)) {
            const courseData = await store.dispatch('loadCourseInfo', {
                $api,
                crn: query.crn
            })
            if (courseData && courseData.instructor && courseData.instructor.length) {
                await $api.courses.getProfessorData({
                    params: {
                        professor_name: courseData.instructor
                    }
                }).then(professorData => {
                    professor = professorData
                }).catch(err => {
                    professor = false
                })
            }
        }
        return {
            selected,
            crn: query.crn || undefined,
            tempQuery: query.query || '',
            query: query.query || '',
            professor,
            courseInfo: (await store.getters.courseInfo(query.crn) || {}),
            ...courseData,
        }
    },
    watchQuery: [
        'time',
        'available',
        'campus',
        'subject',
        'course',
        'days',
        'instructor',
        'attributes'
    ],
    watch: {
        selected: {
            handler: function([timeFilter, availableFilter, campusFilter, subjectFilter, courseFilter, dayFilter, profFilter, attrFilter]) {
                this.$router.push({
                    name: 'courses',
                    query: {
                        crn: this.$router.currentRoute.query.crn,
                        ...[
                            ['time', timeFilter],
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
            this.$router.push({
                name: 'courses',
                query: {
                    ...this.$router.currentRoute.query,
                    query: this.query.length ? this.query : undefined
                }
            })
            setTimeout(() => { //give the search 50 ms to compute
                this.$vuetify.goTo(this.$refs.results, {
                    offset: -70
                })
            }, 50)
        },
        async openCourse(crn) {
            console.log('Switching to: ', crn)
            this.$router.push({
                name: 'courses',
                query: {
                    ...this.$router.currentRoute.query,
                    crn
                }
            })
            this.crn = crn
            if (this.$store.getters.loadedCourseInfo(crn)) {
                this.courseInfo = this.$store.getters.courseInfo(crn)
            } else {
                this.loading = true
                this.courseInfo = await this.$store.dispatch('loadCourseInfo', {
                    $api: this.$api,
                    crn
                })

            }
            if (this.courseInfo.instructor && this.courseInfo.instructor.length) {
                this.$api.courses.getProfessorData({
                    params: {
                        professor_name: this.courseInfo.instructor
                    }
                }).then(professorData => {
                    this.professor = professorData
                }).catch(err => {
                    this.professor = false
                })
            }
            this.loading = false
        },
        addCourse() {
            this.adding = true
            this.$store.dispatch('planner/addCourse', {
                payload: this.courseInfo,
                $api: this.$api
            })
            setTimeout(() => (this.adding = false), 200)
        },
        showPlanner() {
            //close modal
            this.crn = false

            if (this.$store.state.planner.curTab === 2) {
                return this.showCourses()
            }
            this.$store.commit('planner/showPlanner')
        }
    },
    computed: {
        image() {
            const professor = this.professor
            if (professor) {
                return professor.images[0]
            }
            return 'https://image.shutterstock.com/mosaic_250/0/0/518740741.jpg'
        },
        bio() {
            const professor = this.professor
            if (professor) {
                return professor.bio.join('\n')
            }
        },
        link() {
            const professor = this.professor
            if (professor) {
                return professor.link
            }
        },
        inPlanner() {
            if (!this.courseInfo) {
                return false
            }
            return this.$store.getters['planner/isInPlan'](this.courseInfo)
        },
        categories_results() {
            //TODO actual filtering
            const [timeFilter, availableFilter, campusFilter, subjectFilter, courseFilter, dayFilter, profFilter, attrFilter] = this.selected,
                filter = course => {
                    if (timeFilter === Boolean(timeFilter)) {
                        if (!timeFilter) {
                            alert("Now we are filtering")
                        }
                    }
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
                        if (!Array.isArray(course.attributes) || !course.attributes.includes(attrFilter)) {
                            return false
                        }
                    }
                    return true
                },
                query = (this.query || '').trim().toLowerCase(),
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
        modal: {
            get() {
                return !!this.crn
            },
            set(value) {
                if (!value) {
                    this.openCourse(undefined)
                }
            }
        },
        classesIndex() {
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
            return classesIndex
        },
        subjectIndex() {
            const subjectIndex = new Search('subject')
            subjectIndex.addIndex('shortcode')
            subjectIndex.addIndex('subject')
            subjectIndex.addIndex(['courses', 'attributes'])
            subjectIndex.addIndex(['courses', 'id'])
            subjectIndex.addIndex(['courses', 'title'])
            subjectIndex.addDocuments(this.categories)
            return subjectIndex
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

.v-btn--large {
    height: 48px;
}
</style>
