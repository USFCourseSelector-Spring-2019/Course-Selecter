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
            <h2>Course ID: {{course.shortcode}} {{course.id}}</h2>
            <h2>CRN: {{course.crn}}</h2>
            <h2>Proffessor: {{course.instructor}}</h2>
            <p>Proffessor Bio...</p>
            <p>{{conflictsWith(course)}}This will be where you can add this course to your course cart and probably show info on the Proffessor, Course Description and any other relevant info on this course</p>
        </v-card-text>
        <v-card-actions class="pb-3 px-3">
            <v-btn :color="adding?'success':'primary'" v-if="showAdded" @click="added?(showPlanner()):addCourse()" :loading="adding" class="primary-fg--text">
                <v-icon left>{{added?'view_list':'add'}}</v-icon><span v-text="added?'Show in Planner':'Add to Planner'"></span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    data() {
            return {
                adding: false,
                added: this.isInCart(this.course)
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
