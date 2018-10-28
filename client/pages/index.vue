<template>
    <v-container>
        <h1 class="headline text-xs-center">Welcome!</h1>
        <div class="text-xs-center">
            <img src="/icon.png" alt="USF Logo" class="my-3" />
        </div>
        <v-card class="flex xs12 sm8 md6 mx-auto" to="/courses">
            <v-card-title class="title text-xs-center font-weight-regular">We handle registration, you handle college</v-card-title>
            <v-card-text>
                This website help you pick and plan your courses faster!
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat nuxt to="/courses">Search for Courses</v-btn>
            </v-card-actions>
        </v-card>
        <v-card class="flex xs12 sm8 md6 mx-auto my-5">
            <h1 class="title text-xs-center font-weight-regular pt-3">About</h1>
            <v-card-text class="body-1">
                Picking classes has to be one of the worst experiences in college. Constantly trying to make sure that you are progressing with your degree yet also juggling making sure that you have interesting (even fun if you are ambitious) classes while also creating a schedule that you won't dread for the whole semester. On top of all those things you have to keep in mind, you have to deal with the colleges terrible system for picking courses and have at least a million tabs open to the point that you forget which tab shows which little bit of info you need to make a reasonable schedule for a semester. It sure is a lot of pressure on you and the tools <span class="font-weight-bold">should</span> make the process easier not harder, so I made a course selector for USF students like you so that you can pick your courses with ease and still be on your way to your goal of graduating.
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
