<template>
    <v-card flat>
        <v-toolbar color="primary darken-1">
            <v-btn @click="showModal=true" icon>
                <v-icon>settings</v-icon>
            </v-btn>
            <v-toolbar-title class="white--text">My Planner - {{plan.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="$emit('close')">
                <v-icon>close</v-icon>
            </v-btn>
            <v-tabs slot="extension" centered v-model="planner.curTab" slider-color="white" color="transparent" grow>
                <v-tabs-slider color="white"></v-tabs-slider>
                <v-tab>
                    Course Descriptions
                </v-tab>
                <v-tab>
                    Schedule
                </v-tab>
            </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="planner.curTab">
            <v-tab-item key="course">
                <v-card flat>
                    <v-layout column v-if="courses.length">
                        <v-flex v-for="(course,i) in courses" :key="course.index">
                            <Course :course="course" @close="cart.splice(i,1)" :show-added="false" />
                        </v-flex>
                    </v-layout>
                    <v-card-text v-else>
                        <h1 class="text-xs-center display-1 mb-5">Welcome to your Planner!</h1>
                        <p class="text-xs-center">This is where all the courses that you plan to take will be displayed. To begin your plan, add some courses!</p>
                        <v-layout justify-center align-center>
                            <v-btn to="/courses/search" class="text-xs-center" color="primary">
                                <v-icon left>add</v-icon>Add your first course !
                            </v-btn>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item key="schedule">
                <v-card flat>
                    <v-card-text v-if="cart.length">Schedule</v-card-text>
                    <v-card-text v-else>
                        <h1 class="text-xs-center">This will track your schedule with the classes added</h1>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
        <v-dialog v-model="showModal" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card tile>
                <v-toolbar card dark color="primary">
                    <v-btn icon @click.native="showModal = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>My Planner - Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.native="(saveSettings(),showModal = false)">
                            <v-icon left>save</v-icon>Save</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    You can add, edit, delete plans, you can change display options
                </v-card-text>
                <div style="flex: 1 1 auto;"></div>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
import Course from './Course'
export default {
    data() {
            return {
                showModal: false
            }
        },
        mounted() {
            console.log(this.cart, this.$cart)
        },
        methods: {
            saveSettings() {

            }
        },
        components: {
            Course
        }
}
</script>
