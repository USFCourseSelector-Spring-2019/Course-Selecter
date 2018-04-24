<template>
    <v-card flat>
        <v-card-title>
            <h1 v-text="course.title"></h1>
            <v-spacer></v-spacer>
            <h2 class="mr-3" v-text="course.shortcode+' '+course.id"></h2>
            <v-btn icon @click="$emit('close')">
                <v-icon>close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <h3>Proffessor: {{course.instructor}}</h3>
            <p>Proffessor Bio...</p>
            <p>This will be where you can add this course to your course cart and probably show info on the Proffessor, Course Description and any other relevant info on this course</p>
            <v-btn color="primary" v-if="!isAdded">
                <v-icon left>add_shopping_cart</v-icon>Add to Course Cart
            </v-btn>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    data() {
            return {}
        },
        props: ['course', 'isAdded']
}
</script>
