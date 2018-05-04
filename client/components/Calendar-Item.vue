<template>
    <v-tooltip top>
        <v-card class="fill-height" :color="color" :to="`/add-course/${course.crn}`" ripple raised slot="activator">
            <v-card-title class="text-xs-center px-0 py-2 ma-0 d-block black white--text" v-text="course.shortcode + course.id"></v-card-title>
            <span v-text="course.times.map(time=>time.slice(time[0]==='1'?0:1)).join(' - ')"></span>
            <span v-text="course.instructor"></span>
        </v-card>
        <span>{{course.title}} with {{course.instructor}} in {{course.loc}} from {{course.times.map(time=>time.slice(time[0]==='1'?0:1)).join(' - ')}} on {{course.days.join('')}}</span>
    </v-tooltip>
</template>
<script>
export default {
    props: ['course', 'color']
}
</script>
<style>
.fill-height {
    height: 100% !important;
}
</style>
