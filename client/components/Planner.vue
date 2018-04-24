<template>
    <v-card flat>
        <v-toolbar color="primary darken-3">
            <v-toolbar-title class="white--text">My Planner</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="$emit('close')">
                <v-icon>close</v-icon>
            </v-btn>
            <v-tabs slot="extension" centered v-model="curTab" slider-color="white" color="transparent" grow>
                <v-tabs-slider color="white"></v-tabs-slider>
                <v-tab>
                    Courses
                </v-tab>
                <v-tab>
                    Schedule
                </v-tab>
            </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="curTab">
            <v-tab-item key="course">
                <v-card flat>
                    <v-card-text>Courses</v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item key="schedule">
                <v-card flat>
                    <v-card-text>Schedule</v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>
<script>
export default {
    data() {
        return {
            curTab: null
        }
    }
}
</script>
