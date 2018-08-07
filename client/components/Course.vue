<template>
    <v-card flat>
        <v-card-title class="layout">
            <v-flex>
                <h1 v-text="course.title" class="display-1"></h1>
            </v-flex>
            <v-btn icon @click="$emit('close')" class="ml-2">
                <v-icon>close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-layout row>
                <v-layout sm6 class="flex" column justify-space-around>
                    <h2 class="title">ID: {{course.shortcode}} {{course.id}}</h2>
                    <h2 class="title">CRN: {{course.crn}}</h2>
                    <h2 class="title">Days: {{course.days.join('')}}</h2>
                    <h2 class="title">Times: {{course.times.join(' - ')}}</h2>
                </v-layout>
                <v-flex sm6 class="avatar">
                    <h2 class="text-xs-center mb-3">Instructor: {{course.instructor}}</h2>
                    <a :href="link" target="_blank"><img :src="image" class="elevation-1 proffessor-img" /></a>
                    <p v-text="bio" class="mx-3 mt-4">Proffessor Bio... and Proffessor images</p>
                </v-flex>
            </v-layout>
            <v-alert :value="canAddToPlanner(course) && conflictsWith(course)[0].index!==course.index" color="error" icon="warning">
                The course times of this course conflicts with {{conflictsWith(course).length===1?'this course:':'these courses:'}}
                <span v-for="(conflict,i) in conflictsWith(course)" :key="conflict.index">
                    {{i>1?',':' '}}{{conflict.title}} - {{conflict.shortcode}} {{course.id}} with {{course.instructor}}
                </span>
            </v-alert>
        </v-card-text>
        <v-card-actions class="pb-3 px-3">
            <v-btn :color="adding?'success':'primary'" v-if="showAdded" @click="inPlanner?showPlanner():addCourse()" :loading="adding" class="primary-fg--text">
                <v-icon left>{{inPlanner?'view_list':'add'}}</v-icon><span v-text="inPlanner?'Show in Plan':'Add to Plan'"></span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import getProfessorData from '../assets/getProfessorData'

export default {
    data() {
            getProfessorData(this.course.instructor).then(professorData => {
                this.professor = professorData
            })
            return {
                adding: false,
                professor: false
            }
        },
        props: {
            course: Object,
            showAdded: {
                default: true,
                type: Boolean
            }
        },
        methods: {
            addCourse() {
                this.adding = true
                this.$store.commit('planner/addCourse', this.course)
                setTimeout(() => (this.adding = false), 500)
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
                return this.$store.getters['planner/isInPlan'](this.course)
            }
        },
}
</script>
<style>
.avatar img.proffessor-img {
    width: 33%;
    border: 1px solid #DDD;
    margin: 0 auto;
    display: block;
}
</style>
