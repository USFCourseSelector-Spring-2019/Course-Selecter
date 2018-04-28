<template>
    <v-layout column justify-center align-center class="fill-height">
        <v-flex v-text="course.shortcode + course.id"></v-flex>
        <v-flex v-text="course.times.map(time=>time.slice(1)).join(' - ')"></v-flex>
    </v-layout>
</template>
<script>
export default {
    props: ['course']
}
</script>
