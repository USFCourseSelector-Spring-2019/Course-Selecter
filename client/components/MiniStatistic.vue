<template>
    <v-card class="full-height">
        <v-layout row class="ma-0" fill-height>
            <v-flex xs6 class="layout column ma-0 justify-center align-center">
                <v-icon size="56px" :color="color">{{icon}}</v-icon>
            </v-flex>
            <v-flex xs6 :class="`layout column ma-0 px-1 justify-center align-center text-sm-center white--text ${color}`">
                <div class="headline">{{ title }}</div>
                <span class="caption">{{ subTitle }}</span>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script>
export default {
    props: {
        icon: String,
        title: String,
        subTitle: String,
        color: String
    }
};
</script>
