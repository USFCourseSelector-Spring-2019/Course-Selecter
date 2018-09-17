<template>
    <v-card :class="`full-height pa-2 ma-0 layout column justify-space-between course-card ${available?'enabled':'disabled'}`" :color="available?'primary primary-fg--text':'grey lighten-3 grey--text text--darken-1'" v-on:click.native="$emit('open-course',crn)" :ripple="available?{ class: 'primary-fg--text' }:{ class: 'red--text' }" :hover="available">
        <v-flex xs3 md6>
            <h1 v-text="title" class="headline mb-3 mt-2 break-word"></h1>
        </v-flex>
        <h2 v-text="shortcode+id" class="title mb-3 font-weight-regular"></h2>
        <h3 v-text="instructor" class="title mb-3 font-weight-regular"></h3>
        <v-layout justify-space-between align-center row wrap class="px-0 no-grow ma-0">
            <h4 v-text="days.join('')" class="title font-weight-regular"></h4>
            <h4 v-text="times.map(timeFilter).join(' - ')" class="title my-2 font-weight-regular"></h4>
        </v-layout>
    </v-card>
</template>
<script>
export default {
    data() {
            return {
                adding: false,
                professor: false,
                openCourseInfo: false
            }
        },
        mounted() {
            /*
            this.$api.courses.getProfessorData({
                params: {
                    professor_name: this.course.instructor
                }
            }).then(professorData => {
                this.professor = professorData
            }).catch(err => {
                this.professor = false
            })*/
        },
        props: {
            available: Boolean,
            crn: String,
            shortcode: String,
            id: String,
            section: String,
            campus: String,
            credits: String,
            title: String,
            days: Array,
            times: Array,
            capacity: Number,
            enrolled: Number,
            remaining: Number,
            "wl_remaing": String,
            instructor: String,
            dates: Array,
            loc: String,
            attributes: Array,
            subject: String,
            index: Number,
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
            },
            timeFilter(time) {
                if (time.startsWith("0")) {
                    time = time.slice(1)
                }
                return time.slice(0, -3) + time.slice(-2).toUpperCase()
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
.enabled,
.disabled {
    cursor: pointer;
    user-select: none;
}

.course-card {
    transform: translateY(0px);
    transition: all 300ms;
}

.course-card:hover {
    transform: translateY(-6px);
}

.no-grow {
    flex-grow: 0 !important;
}

.break-word {
    word-wrap: break-word;
}
</style>
