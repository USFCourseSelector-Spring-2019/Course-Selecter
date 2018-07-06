<template>
    <v-container>
        Add Course: {{id}} This page will allow you to actually add this specific course to your USF course cart thing
    </v-container>
</template>
<script>
export default {
    data() {
            return {}
        },
        asyncData({
            params: {
                id
            }
        }) {
            return Promise.resolve({
                id
            })
        }
}
</script>
