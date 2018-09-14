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
            <v-layout row wrap>
                <v-layout xl5 lg6 xs12 class="flex" column>
                    <h2 class="headline font-weight-regular py-2">ID: {{course.shortcode}} {{course.id}}</h2>
                    <h3 class="title font-weight-regular py-2">Identifier (CRN):{{course.crn}}</h3>
                    <h4 class="subheading font-weight-regular py-2">{{course.days.join('')}} {{course.times.join(' - ')}}</h4>
                    <v-flex class="my-1"></v-flex>
                    <v-layout row wrap class="no-grow">
                        <v-flex xs3 class="pr-1">
                            <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                <div class="headline">{{Number(course.credits).toFixed(0)}}</div>
                                <span class="subheader">Credits</span>
                            </v-card>
                        </v-flex>
                        <v-flex xs3 class="pr-1">
                            <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                <div class="headline">{{course.enrolled}}</div>
                                <span class="subheader">Enrolled</span>
                            </v-card>
                        </v-flex>
                        <v-flex xs3 class="px-0">
                            <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                <div class="headline">{{course.remaining}}</div>
                                <span class="subheader">Remaining</span>
                            </v-card>
                        </v-flex>
                        <v-flex xs3 class="pl-1">
                            <v-card class="full-height layout column justify-center align-center text-sm-center py-2 px-0 primary-fg--text primary">
                                <div class="headline">{{course.wl_remaining}}</div>
                                <span class="subheader">Waitlist</span>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-layout>
                <v-flex xl7 lg6 xs12 class="avatar">
                    <h2 class="text-xs-center headline">{{course.instructor}}</h2>
                    <h3 class="text-xs-center caption">Instructor</h3>
                    <a :href="link" target="_blank"><img :src="image" class="elevation-1 proffessor-img mt-3" /></a>
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
export default {
    data() {
            return {
                adding: false,
                professor: false
            }
        },
        mounted() {
            this.$api.courses.getProfessorData({
                params: {
                    professor_name: this.course.instructor
                }
            }).then(professorData => {
                this.professor = professorData
            }).catch(err => {
                this.professor = false
            })
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

.no-grow {
    flex-grow: 0 !important;
}
</style>
