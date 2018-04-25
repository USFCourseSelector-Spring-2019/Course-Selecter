<template>
    <v-app dark>
        <v-navigation-drawer v-model="drawer" temporary app disable-resize-watcher>
            <v-list>
                <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app color="primary darken-1">
            <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="togglePlanner">
                <v-icon>view_list</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <nuxt />
        </v-content>
        <v-navigation-drawer temporary right v-model="planner.visible" fixed floating width="600">
            <Planner @close="hidePlanner" />
        </v-navigation-drawer>
        <!--<v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
            <Planner @close="hidePlanner" />
        </v-dialog>-->
    </v-app>
</template>
<script>
import Planner from '../components/Planner'
export default {
    data() {
            return {
                drawer: false,
                fixed: false,
                items: [{
                    icon: 'apps',
                    title: 'Home',
                    to: '/'
                }, {
                    icon: 'bubble_chart',
                    title: 'Browse Courses',
                    to: '/courses'
                }],
                title: 'USF Course Selector'
            }
        },
        computed: {
            dialog() {
                return this.planner.visible && this.$vuetify.breakpoint.smAndDown
            }
        },
        components: {
            Planner
        }
}
</script>
