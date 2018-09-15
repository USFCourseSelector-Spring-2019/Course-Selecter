<template>
    <div class="fill-height layout justify-center align-center">
        <v-card class="flex sign-out-card" raised>
            <v-card-title>
                <h1 class="display-1">Successfully Signed out!</h1>
            </v-card-title>
            <v-card-text>
                We hope to see you again soon!
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn to="/sign-in" color="primary">
                        Sign Back In
                    </v-btn>
                </v-layout>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
export default {
    auth: false,
    data() {
        return {}
    },
    methods: {},
    head() {
        return {
            title: `Signed out - Course Selector`
        }
    }
}
</script>
<style>
.sign-out-card {
    max-width: 600px;
    width: 100%;
}
</style>
