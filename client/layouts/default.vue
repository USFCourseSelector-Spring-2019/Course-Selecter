<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" temporary app disable-resize-watcher>
            <v-list>
                <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in links" exact>
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app color="primary" class="primary-fg--text">
            <v-toolbar-side-icon @click="drawer = !drawer" color="primary-fg" flat></v-toolbar-side-icon>
            <img src="/icon.png" height="38px" />
            <v-toolbar-title v-text="title" :class="{'ml-2':$vuetify.breakpoint.smAndDown}"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click.stop="logout" v-if="$auth.loggedIn" color="primary-fg" flat class="hidden-sm-and-down">
                Sign out
            </v-btn>
            <v-btn href="/sign-up" v-else color="primary-fg" flat class="hidden-sm-and-down">
                Sign Up
            </v-btn>
            <v-btn icon @click.stop="togglePlanner" color="primary-fg" flat>
                <v-icon>view_list</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <nuxt />
        </v-content>
        <v-navigation-drawer temporary right v-model="visibilePlanner" fixed floating width="600">
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
                title: 'USF Course Selector'
            }
        },
        mounted() {
            this.loadSettings()
        },
        methods: {
            async logout() {
                await this.$auth.logout()
                this.loadSettings()
            },
            loadSettings() {
                return this.$store.dispatch('planner/loadSettings', {
                    $api: this.$api
                })
            }
        },
        computed: {
            dialog() {
                return this.$store.getters['planner/plannerIsVisible'] && this.$vuetify.breakpoint.smAndDown
            },
            visibilePlanner: {
                get() {
                    return this.$store.getters['planner/plannerIsVisible']
                },
                set(val) {
                    this.$store.commit('planner/' + (val ? 'showPlanner' : 'hidePlanner'))
                }
            },
            links() {
                return [{
                    icon: 'apps',
                    title: 'Home',
                    to: '/'
                }, this.$auth.loggedIn ? {
                    icon: 'apps',
                    title: 'Dashboard',
                    to: '/dashboard'
                } : {
                    icon: 'apps',
                    title: 'Sign up for more features',
                    to: '/sign-up'
                }, {
                    icon: 'bubble_chart',
                    title: 'Browse Courses',
                    to: '/courses'
                }]
            }
        },
        components: {
            Planner
        }
}
</script>
