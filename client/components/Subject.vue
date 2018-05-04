<template>
    <v-card raised class="mx-1 my-3">
        <v-card-title class="primary-fg--text primary">
            <h3 v-text="subject.subject" class="display-1"></h3>
            <v-spacer></v-spacer>
            <h3 v-text="subject.shortcode" class="title"></h3>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" hide-actions item-key="index" expand>
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
                <tr @click="(props.expanded = !props.expanded)" :class="{error:!props.item.available,'datatable__expand-row':!props.item.available,enabled:props.item.available}" :key="expand(props).item.index" :id="props.item.index">
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
                <Course :course="props.item" @close="props.expanded=0" :show-added="true" v-if="props.item.available && props.expanded" />
                <v-alert :value="props.item.available===false" color="error" icon="warning" v-else>
                    Sorry {{props.item.title}} on {{props.item.days.join('')}} with {{props.item.instructor}} at {{props.item.times.join(" - ")}} is closed. Even the wait list is full or closed off.
                </v-alert>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search found no results.
            </v-alert>
        </v-data-table>
    </v-card>
</template>
<script>
import Course from './Course'
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
            items() {
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
            Course
        },
        methods: {
            expand(props) {
                if (this.items.length === 1 && props.expanded !== 0) {
                    props.expanded = true
                }
                return props
            }
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
</style>
