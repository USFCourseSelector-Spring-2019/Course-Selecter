<template>
    <v-container>
        {{data}}
    </v-container>
</template>
<script>
export default {
    auth: false,
    async asyncData({
        params: {
            crn
        },
        app: {
            $api
        }
    }) {
        const data = await $api.courses.getCourseData({
            params: {
                crn,
                semester: 'current'
            }
        })
        return {
            data
        }
    },
    data() {
        return {}
    }
}
</script>
