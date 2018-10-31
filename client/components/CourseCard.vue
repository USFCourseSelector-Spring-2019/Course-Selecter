<template>
    <v-card :class="`full-height pa-2 ma-0 layout column justify-space-around course-card ${available?'enabled':'disabled'}`" :color="inPlanner?'blue darken-4 white--text':available?'primary primary-fg--text':'grey lighten-3 grey--text text--darken-1'" v-on:click.native="$emit('open-course',crn)" :ripple="available?{ class: 'primary-fg--text' }:{ class: 'red--text' }" :hover="available">
        <v-flex xs3 md6>
            <h1 v-text="title" :class="`${$vuetify.breakpoint.smAndDown?'title':'headline'} font-weight-regular mb-3 mt-2 break-word`"></h1>
        </v-flex>
        <h2 v-text="shortcode+id" :class="`${$vuetify.breakpoint.smAndDown?'subheading':'title'} font-weight-regular mb-3 font-weight-regular`"></h2>
        <h3 v-text="instructor" :class="`${$vuetify.breakpoint.smAndDown?'subheading':'title'} font-weight-regular mb-3 font-weight-regular`"></h3>
        <v-layout justify-space-between align-center row wrap class="px-0 no-grow ma-0">
            <h4 v-text="days.join('')" :class="`${$vuetify.breakpoint.smAndDown?'subheading':'title'} font-weight-regular font-weight-regular`"></h4>
            <h4 v-text="times.map(timeFilter).join(' - ')" :class="`${$vuetify.breakpoint.smAndDown?'subheading':'title'} font-weight-regular my-2 font-weight-regular`"></h4>
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
                this.$store.dispatch('planner/addCourse', {
                    payload: this.course,
                    $api: this.$api
                })
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
            inPlanner() {
                return this.$store.getters['planner/isInPlan'](this)
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

.course-card.enabled:hover {
    transform: translateY(-6px);
}

.no-grow {
    flex-grow: 0 !important;
}

.break-word {
    word-wrap: break-word;
}
</style>
