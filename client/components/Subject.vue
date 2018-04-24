<template>
    <v-card raised class="ma-2">
        <v-card-title>
            <h3 v-text="subject.subject"></h3>
            <v-spacer></v-spacer>
            <h3 v-text="subject.shortcode"></h3>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" hide-actions item-key="index">
            <template slot="items" slot-scope="props">
                <tr @click="(props.expanded = !props.expanded)" :class="{disabled:!props.item.available,'datatable__expand-row':!props.item.available,enabled:props.item.available}" :key="props.item.index">
                    <td>{{ props.item.title }}</td>
                    <td class="text-xs-center">{{ props.item.shortcode }} {{props.item.id}}</td>
                    <td class="text-xs-center">{{ props.item.days.join('') }}</td>
                    <td class="text-xs-left">{{ props.item.times.join(' - ') }}</td>
                    <td class="text-xs-center">{{ props.item.credits }}</td>
                    <td class="text-xs-center">{{ props.item.enrolled }}</td>
                    <td class="text-xs-center">{{ props.item.remaining }}</td>
                    <td class="text-xs-center">{{ props.item.wl_remaining }}</td>
                </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <Course :course="props.item" @close="props.expanded=false" :is-added="false" v-if="props.item.available" />
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
                    sortable: true
                }, {
                    text: 'Course ID',
                    value: 'id',
                    align: 'center',
                    sortable: true
                }, {
                    text: 'Days',
                    value: 'days',
                    align: 'center',
                    sortable: false
                }, {
                    text: 'Meeting Times',
                    value: 'times',
                    sortable: false
                }, {
                    text: 'Cred',
                    value: 'credits',
                    align: 'center',
                    sortable: false
                }, {
                    text: '# Enrolled',
                    value: 'enrolled',
                    align: 'center',
                    sortable: false
                }, {
                    text: 'Spots Remaining',
                    value: 'remaining',
                    align: 'center',
                    sortable: false
                }, {
                    text: 'Spots (WL)',
                    value: 'wl_remaining',
                    align: 'center',
                    sortable: false
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
        }
}
</script>
<style>
tr.disabled {
    background-color: #622;
}

tr.enabled {
    cursor: pointer;
}

.theme--dark .table tbody tr:nth-last-child(2) {
    border-bottom: none;
}
</style>
