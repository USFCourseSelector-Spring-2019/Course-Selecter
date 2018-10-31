<template>
    <div>
        <v-card raised class="mx-1 my-3" v-if="$vuetify.breakpoint.lgAndUp">
            <v-card-title class="primary-fg--text primary layout row">
                <h3 v-text="subject.subject" class="display-1"></h3>
                <v-spacer></v-spacer>
                <h3 v-text="subject.shortcode" class="title"></h3>
            </v-card-title>
            <v-data-table :headers="headers" :items="courses" hide-actions item-key="index" expand>
                <template slot="headerCell" slot-scope="props">
                    <v-tooltip bottom :disabled="!props.header.description">
                        <span slot="activator" class="secondary-fg--text">
                  {{ props.header.text }}
                </span>
                        <span>
                  {{ props.header.description }}
                </span>
                    </v-tooltip>
                </template>
                <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded, goTo($refs[`row-${props.item.crn}`])" :ref="`row-${props.item.crn}`" :class="{'grey lighten-4 grey--text text--darken-1 fix-border':!props.item.available,'datatable__expand-row':!props.item.available,enabled:props.item.available}" :key="expand(props).item.index" :id="props.item.index">
                        <td>{{ props.item.title }}</td>
                        <td class="text-xs-center">{{ props.item.shortcode }} {{props.item.id}}</td>
                        <td class="text-xs-left">{{ props.item.instructor }}</td>
                        <td class="text-xs-center">{{ props.item.days.join('') }}</td>
                        <td class="text-xs-left">{{ props.item.times.join(' - ') }}</td>
                        <td class="text-xs-center">{{ props.item.credits }}</td>
                        <td class="text-xs-center">{{ props.item.enrolled }}</td>
                        <td class="text-xs-center">{{ props.item.remaining }}</td>
                        <td class="text-xs-center">{{ props.item.wl_remaining }}</td>
                    </tr>
                </template>
                <template slot="expand" slot-scope="props">
                    <Course :course="props.item" @close="props.expanded=0" v-if="props.item.available && props.expanded" />
                    <v-alert :value="props.item.available===false" color="red darken-4" icon="warning" v-else @click="props.expanded=false" class="my-0">
                        Sorry {{props.item.title}} on {{props.item.days.join('')}} with {{props.item.instructor}} at {{props.item.times.join(" - ")}} is closed. Even the wait list is full or closed off.
                        <v-icon class="right" color="white" @click.stop="props.expanded=false">close</v-icon>
                    </v-alert>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search found no results.
                </v-alert>
            </v-data-table>
        </v-card>
        <v-container v-else>
            <v-layout justify-space-between row>
                <v-subheader v-text="subject.subject" class="px-0 title"></v-subheader>
                <v-subheader v-text="subject.shortcode" class="px-0 title"></v-subheader>
            </v-layout>
            <v-container fluid grid-list-md class="pa-0">
                <v-layout row wrap>
                    <v-flex v-for="course in courses" :key="course.index" xs6 sm4 md3 xl2>
                        <course-card v-bind="course" v-on:open-course="(crn)=>$emit('open-course',crn)"></course-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-container>
    </div>
</template>
<script>
import Course from './Course'
import CourseCard from './CourseCard'
export default {
    data() {
            return {
                headers: [{
                    text: 'Title',
                    value: 'title',
                    sortable: true,
                    class: ['secondary']
                }, {
                    text: 'Course ID',
                    value: 'id',
                    align: 'center',
                    sortable: true,
                    class: ['secondary']
                }, {
                    text: 'Instructor',
                    value: 'instructor',
                    align: 'left',
                    sortable: true,
                    class: ['secondary'],
                    description: 'Proffessor'
                }, {
                    text: 'Days',
                    value: 'days',
                    align: 'center',
                    sortable: false,
                    class: ['secondary']
                }, {
                    text: 'Meeting Times',
                    value: 'times',
                    sortable: false,
                    class: ['secondary']
                }, {
                    text: 'Cred',
                    value: 'credits',
                    align: 'center',
                    sortable: false,
                    class: ['secondary'],
                    description: 'Amount of credits the course is worth'
                }, {
                    text: '# Enrolled',
                    value: 'enrolled',
                    align: 'center',
                    sortable: false,
                    class: ['secondary'],
                    description: 'Number of people enrolled in the class'
                }, {
                    text: 'Spots Remaining',
                    value: 'remaining',
                    align: 'center',
                    sortable: false,
                    class: ['secondary'],
                    description: 'Number of spots left in the class'
                }, {
                    text: 'Spots (WL)',
                    value: 'wl_remaining',
                    align: 'center',
                    sortable: false,
                    class: ['secondary'],
                    description: 'Number of spots on the waitlist left'
                }]
            }
        },
        props: ['subject'],
        computed: {
            courses() {
                return this.subject.courses.reduce((arr, course) => {
                    const classes = course.classes
                    classes.forEach(classy => {
                        const id = classy.id
                        arr.push(classy)
                    })
                    return arr
                }, [])
            }
        },
        components: {
            Course,
            CourseCard
        },
        methods: {
            expand(props) {
                if (this.courses.length === 1 && props.expanded !== 0) {
                    props.expanded = true
                }
                return props
            },
            goTo(where) {
                this.$vuetify.goTo(where, {
                    offset: -70
                })

            },
        }
}
</script>
<style>
tr.disabled {
    background-color: #D44;
}

tr.enabled {
    cursor: pointer;
}

.theme--dark .table tbody tr:nth-last-child(2) {
    border-bottom: none;
}

@media only screen and (min-width: 960px) {
    .container {
        max-width: unset !important;
    }
}

.theme--light .v-table tbody tr.fix-border {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>
