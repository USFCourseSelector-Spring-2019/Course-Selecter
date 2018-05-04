<template>
    <v-card class="my-2" raised>
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
                    <h2>ID: {{course.shortcode}} {{course.id}}</h2>
                    <h2>CRN: {{course.crn}}</h2>
                    <h2>Proffessor: {{course.instructor}}</h2>
                    <h2>Days: {{course.days.join('')}}</h2>
                    <h2>Times: {{course.times.join(' - ')}}</h2>
                </v-layout>
                <v-flex sm6 class="avatar">
                    <a :href="link" target="_blank"><img :src="image" class="elevation-1 proffessor-img" /></a>
                </v-flex>
            </v-layout>
            <p v-text="bio">Proffessor Bio... and Proffessor images</p>
            <p>Course Description and any other relevant info on this course...</p>
            <v-alert :value="canAddToPlanner(course) && conflictsWith(course)[0].index!==course.index" color="error" icon="warning">
                The course times of this course conflicts with {{conflictsWith(course).length===1?'this course:':'these courses:'}}
                <span v-for="(conflict,i) in conflictsWith(course)" :key="conflict.index">
                    {{i>1?',':' '}}{{conflict.title}} - {{conflict.shortcode}} {{course.id}} with {{course.instructor}}
                </span>
            </v-alert>
        </v-card-text>
        <v-card-actions class="pb-3 px-3">
            <v-btn :color="adding?'success':'primary'" v-if="showAdded" @click="added?(showPlanner()):addCourse()" :loading="adding" class="primary-fg--text">
                <v-icon left>{{added?'view_list':'add'}}</v-icon><span v-text="added?'Show in Planner':'Add to Planner'"></span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import getProffessorData from '../assets/getProffessorData'
export default {
    data() {
            getProffessorData(this.course.instructor).then(professorData => {
                this.professor = professorData
            })
            return {
                adding: false,
                added: this.isInCart(this.course),
                professor: false
            }
        },
        props: ['course', 'showAdded'],
        methods: {
            addCourse() {
                this.adding = true
                this.$cart.add(this.course)
                setTimeout(() => (this.added = true, this.adding = false), 500)
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
            }
        },
        watch: {
            cart: {
                deep: true,
                handler() {
                    if (this.added || this.adding) {
                        if (!this.isInCart(this.course)) {
                            this.added = false
                            this.adding = false
                        }
                    }
                }
            }
        }
}
</script>
<style>
.avatar img.proffessor-img {
    width: 33%;
    border: 1px solid white;
}
</style>
