<template>
    <v-tooltip left max-width="200">
        <v-card class="fill-height calendar-item" :color="color" :to="`/courses/add/${course.crn}`" ripple raised slot="activator" :data-start="course.times[0]" :data-end="course.times[1]">
            <v-card-title class="text-xs-center px-0 py-2 ma-0 d-block primary primary-fg--text" v-text="course.shortcode + course.id"></v-card-title>
            <div v-text="course.instructor" class="text-xs-center"></div>
            <div v-text="course.times.map(time=>time.slice(time[0]==='1'?0:1)).join(' - ')" class="text-xs-center"></div>
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

.calendar-item::after,
.calendar-item::before {
    position: absolute;
    display: block;
    width: 100%;
    left: 0;
    right: 0;
    text-align: center;
    background-color: #FFF;
}

.calendar-item::after {
    content: attr(data-end);
    bottom: -20px;
}

.calendar-item::before {
    content: attr(data-start);
    top: -20px;
}
</style>
