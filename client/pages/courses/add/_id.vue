<template>
    <v-container>
        Add Course: {{id}} This page will allow you to actually add this specific course to your USF course cart thing
        <v-layout>
            <iframe src="https://hebe.usfca.edu/prod/bwskfreg.P_AddDropCrse" seamless class="iframe" />
            </iframe>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    data() {
            return {}
        },
        async asyncData({
            params: {
                id
            }
        }) {
            //need to load data on 1 course for this
            return {
                id
            }
        }
}
</script>
<style>
.iframe {
    width: 100%;
    height: 100%;
    min-height: 700px;
}
</style>
