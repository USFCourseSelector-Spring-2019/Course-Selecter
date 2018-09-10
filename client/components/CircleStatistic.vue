<template>
    <v-card>
        <v-card-title>
            <div class="layout row ma-0 justify-space-between pb-1">
                <div class="subheading">{{title}}</div>
                <div class="icon">
                    <v-icon :color="color">{{icon}}</v-icon>
                </div>
            </div>
        </v-card-title>
        <v-card-text>
            <div class="justify-center row layout ma-0">
                <v-progress-circular :size="150" :width="15" :rotate="-90" :value="value" :color="color">
                    {{ value }}%
                </v-progress-circular>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <div class="headline mx-2">{{subTitle}}</div>
            <div class="body-1 pl-1">{{caption}}</div>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    props: {
        icon: String,
        title: String,
        subTitle: String,
        caption: String,
        value: Number,
        color: String
    },
};
</script>
<style>
</style>
