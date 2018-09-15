<template>
    <v-container>
        <div class="text-xs-center">
            <img src="/icon.png" alt="USF Logo" class="mb-5" />
        </div>
        <v-card class="flex xs12 sm8 md6 mx-auto">
            <v-card-title class="headline">Welcome to the USF Course Selector</v-card-title>
            <v-card-text>
                <p>This website aims to help you pick your courses faster!</p>
                <hr class="my-3">
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat nuxt to="/courses">Search for Courses</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
export default {
    auth: false
}
</script>
