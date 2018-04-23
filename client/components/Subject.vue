<template>
    <v-card raised class="ma-2">
        <v-card-title>
            <h3 v-text="subject.subject"></h3>
            <v-spacer></v-spacer>
            <h3 v-text="subject.shortcode"></h3>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" hide-actions>
            <template slot="items" slot-scope="props">
                <tr @click="props.item.available&&(props.expanded = !props.expanded)" :class="{disabled:!props.item.available}" :key="props.item.index">
                    <td>{{ props.item.title }}</td>
                    <td class="text-xs-center">{{ props.item.shortcode }} {{props.item.course_id}}</td>
                    <td class="text-xs-center">{{ props.item.days.join('') }}</td>
                    <td class="text-xs-left">{{ props.item.times.join(' - ') }}</td>
                    <td class="text-xs-center">{{ props.item.credits }}</td>
                    <td class="text-xs-center">{{ props.item.enrolled }}</td>
                    <td class="text-xs-center">{{ props.item.remaining }}</td>
                    <td class="text-xs-center">{{ props.item.wl_remaining }}</td>
                </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <v-card flat>
                    <v-card-title>
                        <h1 v-text="props.item.title"></h1>
                        <v-spacer></v-spacer>
                        <h2 v-text="props.item.shortcode+props.item.course_id"></h2>
                    </v-card-title>
                    <v-card-text>
                        This will be where you can add this course to your course cart and probably show info on the Proffessor, Course Description and any other relevant info on this course
                        <v-btn color="primary">
                            <v-icon left>add_shopping_cart</v-icon>Add to Course Cart
                        </v-btn>
                    </v-card-text>
                </v-card>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search found no results.
            </v-alert>
        </v-data-table>
    </v-card>
</template>
<script>
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
                        arr.push({...classy,
                            id: classy.index,
                            course_id: id
                        })
                    })
                    return arr
                }, [])
            }
        }
}
</script>
<style>
.disabled {
    background-color: #622;
}
</style>
