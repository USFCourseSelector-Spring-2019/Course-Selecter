<template>
    <v-layout column justify-space-around align-center class="fill-height">
        <span v-text="course.shortcode + course.id"></span>
        <span v-text="course.times.map(time=>time.slice(time[0]==='1'?0:1)).join(' - ')"></span>
        <span v-text="course.instructor"></span>
    </v-layout>
</template>
<script>
export default {
    props: ['course']
}
</script>
