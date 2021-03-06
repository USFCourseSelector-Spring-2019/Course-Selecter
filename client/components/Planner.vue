<template>
    <div>
        <v-toolbar color="primary" class="primary-fg--text" tabs>
            <v-btn @click="$store.commit('planner/setTab',2)" icon color="primary-fg" flat>
                <v-icon>settings</v-icon>
            </v-btn>
            <v-toolbar-title>Plan: {{plan.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="$emit('close')" color="primary-fg" flat>
                <v-icon>close</v-icon>
            </v-btn>
            <template v-slot:extension>
                <v-tabs centered v-model="curTab" slider-color="white" color="transparent" grow>
                    <v-tabs-slider color="secondary"></v-tabs-slider>
                    <v-tab ripple class="primary-fg--text" key="course">
                        Courses
                    </v-tab>
                    <v-tab ripple class="primary-fg--text" key="calendar">
                        Calendar
                    </v-tab>
                    <v-tab ripple class="primary-fg--text" key="settings">
                        Settings
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-tabs-items v-model="curTab">
            <v-tab-item key="course">
                <v-card flat>
                    <v-layout column v-if="courses.length">
                        <v-flex v-for="(course,i) in courses" :key="course.index">
                            <Course :course="course" @close="$store.dispatch('planner/removeCourse',{payload:i,$api})" :show-added="false" />
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
            <v-tab-item key="settings">
                <v-card tile>
                    <v-card-title class="title">All Plans</v-card-title>
                    <v-subheader>You can create multiple possible schedules to see which is the best fit for you</v-subheader>
                    <v-card-text>
                        <v-layout column>
                            <v-layout v-for="(curPlan,i) in plans" :key="i">
                                <v-text-field :value="curPlan.title" :label="`Plan #${i+1}`" @change="title=>$store.dispatch('planner/setTitleOf',{payload:{title,index:i},$api})"></v-text-field>
                                <v-btn @click.native.stop="$store.dispatch('planner/setCurPlan',{payload:i,$api})" :disabled="$store.getters['planner/currentPlan']===curPlan" color="primary">{{$store.getters['planner/currentPlan']===curPlan?'Is Current Plan':'Set as Current Plan'}}</v-btn>
                                <v-btn @click.native.stop="$store.dispatch('planner/downloadPlanner',{index: i})" v-if="canDeletePlans">Download</v-btn>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn @click.native.stop="$store.dispatch('planner/removePlan',{payload:i,$api})" icon flat v-on="on">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Delete {{curPlan.title}}</span>
                                </v-tooltip>
                            </v-layout>
                        </v-layout>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn @click.native.stop="$store.dispatch('planner/addPlan',{payload:{title: `Plan #${plans.length+1}`,courses: []},$api})" color="primary" v-on="on">
                                    <v-icon left>add</v-icon>
                                    Add A Plan
                                </v-btn>
                            </template>
                            <span>Adds a clean possible plan to your list of plans</span>
                        </v-tooltip>
                    </v-card-text>
                    <div style="flex: 1 1 auto;"></div>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
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
        computed: {
            curTab: {
                get() {
                    return this.$store.state.planner.curTab
                },
                set(index) {
                    this.$store.commit('planner/setTab', index)
                }
            },
            canDeletePlans(){
                return this.$store.getters['planner/canDeletePlans']
            }
        },
        methods: {
            saveSettings() {

            },
            goToCourses() {
                if (this.$router.currentRoute.path == '/courses') {
                    this.$store.commit('planner/hidePlanner')
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
