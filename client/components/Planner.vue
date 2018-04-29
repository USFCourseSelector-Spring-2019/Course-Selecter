<template>
    <div>
        <v-toolbar color="primary" class="primary-fg--text">
            <v-btn @click="showSettings=true" icon color="secondary" flat>
                <v-icon>settings</v-icon>
            </v-btn>
            <v-toolbar-title>{{plan.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="$emit('close')" color="primary-fg" flat>
                <v-icon>close</v-icon>
            </v-btn>
            <v-tabs slot="extension" centered v-model="planner.curTab" slider-color="white" color="transparent" grow>
                <v-tabs-slider color="primary-fg"></v-tabs-slider>
                <v-tab ripple class="primary-fg--text">
                    Course Descriptions
                </v-tab>
                <v-tab ripple class="primary-fg--text">
                    Calendar
                </v-tab>
            </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="planner.curTab">
            <v-tab-item key="course">
                <v-card flat>
                    <v-layout column v-if="courses.length">
                        <v-flex v-for="(course,i) in courses" :key="course.index">
                            <Course :course="course" @close="courses.splice(i,1)" :show-added="false" />
                        </v-flex>
                    </v-layout>
                    <v-card-text v-else>
                        <h1 class="text-xs-center display-1 mb-5">Welcome to your Planner!</h1>
                        <p class="text-xs-center">This is where all the courses that you plan to take will be displayed. To begin your plan, add some courses!</p>
                        <v-layout justify-center align-center>
                            <v-btn class="text-xs-center primary-fg--text" color="primary" @click="goToCourses">
                                <v-icon left>add</v-icon>Add your first course !
                            </v-btn>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item key="calendar">
                <v-card flat>
                    <Calendar :classes="courses" />
                </v-card>
            </v-tab-item>
        </v-tabs-items>
        <v-dialog v-model="showSettings" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card tile>
                <v-toolbar card dark color="primary">
                    <v-btn icon @click.native="showSettings = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Planner Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.native="(saveSettings(),showSettings = false)" color="secondary">
                            <v-icon left>save</v-icon>Save</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    You can add, edit, delete plans, you can change display options
                </v-card-text>
                <div style="flex: 1 1 auto;"></div>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Course from './Course'
import Calendar from './Calendar'

export default {
    data() {
            return {
                showSettings: false,
            }
        },
        computed: {},
        methods: {
            saveSettings() {

            },
            goToCourses() {
                if (this.$router.currentRoute.path == '/courses') {
                    this.planner.visible = false
                } else {
                    this.$router.push('/courses')
                }
            }
        },
        components: {
            Course,
            Calendar
        }
}
</script>
