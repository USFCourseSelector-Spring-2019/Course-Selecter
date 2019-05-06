<template>
    <div>
        <v-container grid-list-xl fluid>
            <v-layout row wrap justify-center>
                <v-flex lg3 sm6 xs12>
                    <mini-statistic icon="sentiment_very_satisfied" :title="level||'Freshman'" sub-title="Status" color="orange darken-3">
                    </mini-statistic>
                </v-flex>
                <v-flex lg3 sm6 xs12>
                    <mini-statistic icon="navigation" :title="major||'No'" sub-title="Major" color="indigo">
                    </mini-statistic>
                </v-flex>
                <v-flex lg3 sm6 xs12>
                    <mini-statistic icon="near_me" :title="minor||'No'" sub-title="Minor" color="red darken-2">
                    </mini-statistic>
                </v-flex>
                <v-flex lg3 sm6 xs12>
                    <mini-statistic icon="local_library" :title="total_credits_applied.toString()||'0'" sub-title="Credits taken" color="light-blue">
                    </mini-statistic>
                </v-flex>
                <v-flex md4 sm6 xs12>
                    <circle-statistic :icon="total_credits_completion===100?'done':'trending_up'" title="Total Credits Completion" :sub-title="`${total_credits_applied} / ${total_credits_required}`" caption="Credits Completed" :value="total_credits_completion" color="yellow darken-4" />
                </v-flex>
                <v-flex md4 sm6 xs12>
                    <circle-statistic :icon="core_requirements_completion===100?'done':'trending_up'" title="Core Requirements Completion" :sub-title="`${number_of_core_requirements-missing_attributes.length} of ${number_of_core_requirements}`" caption="Requirements Completed" :value="core_requirements_completion" color="green" />
                </v-flex>
                <v-flex md4 sm6 xs12>
                    <circle-statistic :icon="major_credits_completion===100?'done':'trending_up'" title="Major Credits Completion" :sub-title="`${major_credits_applied} / ${major_credits_required}`" caption="Credits Completed" :value="major_credits_completion" color="indigo" />
                </v-flex>
                <v-flex md4 sm6 xs12 v-if="minor">
                    <circle-statistic :icon="minor_credits_completion===100?'done':'trending_up'" title="Minor Credits Completion" :sub-title="`${minor_credits_applied} / ${minor_credits_required}`" caption="Credits Completed" :value="minor_credits_completion" color="red darken-2" />
                </v-flex>
                <v-flex md3 sm6 xs12 class="pa-0">
                    <v-layout row wrap fill-height class="ma-0">
                        <v-flex sm6 xs12>
                            <v-card color="green white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="display-1 pt-3">{{ core_requirements_left }}</div>
                                <v-card-text class="subheading">
                                    Core Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex sm6 xs12>
                            <v-card color="indigo white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="display-1 pt-3">{{ major_requirements_left }}</div>
                                <v-card-text class="subheading">
                                    Major Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex sm6 xs12>
                            <v-card color="blue darken-2 white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="display-1 pt-3">{{ minor_requirements_left }}</div>
                                <v-card-text class="subheading">
                                    Minor Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex sm6 xs12>
                            <v-card color="yellow darken-4 white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="display-1 pt-3">{{ total_requirements_left }}</div>
                                <v-card-text class="subheading">
                                    Total Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>

                    </v-layout>
                </v-flex>

                <v-flex md4 sm12 xs12>
                  <v-card color="yellow darken-1 white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0"> <!--Added-->
                    <v-widget title="Missing Cores">
                        <div slot="widget-content">
                            <v-list>
                              <div v-for="(reqs,i) in major_missing_reqs" :key="i">
                                <v-subheader>Requirement #{{i+1}}{{`${reqs.choose>1?'Choose '+reqs.choose:''}`}}</v-subheader>
                                <v-list-tile avatar v-for="attribute in missing_attributes" :key="attribute">
                                    <v-list-tile-content>
                                        <v-list-tile-title v-text="attribute"></v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                              </div>
                            </v-list>
                        </div>
                    </v-widget>
                  </v-card>
                </v-flex><!--Added-->
                <v-flex md4 sm12 xs12>
                  <v-card color="yellow darken-4 white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0"> <!--Added-->
                    <v-widget title="Missing Major Requirements" >
                        <div slot="widget-content">
                            <div v-for="(reqs,i) in major_missing_reqs" :key="i" class="text-xs-center fill-height layout column justify-center align-center ma-0"> <!--Added-->
                                <v-subheader class="pl-0">Requirement #{{i+1}}{{`${reqs.choose>1||reqs.classes.length>1?' - Choose '+reqs.choose:''}`}}</v-subheader>
                                <v-layout row wrap class="text-xs-center fill-height layout column justify-center align-center ma-0"> <!--Added-->
                                    <v-flex v-for="req in reqs.classes" :key="req.name" md4 xs6>
                                        {{req.name}}
                                    </v-flex>
                                </v-layout>
                            </div>
                        </div>
                    </v-widget>
                  </v-card> <!--Added-->
                </v-flex>
                <v-flex md4 sm12 xs12 v-if="minor_missing_reqs.length">
                    <v-widget title="Missing Minor Requirements">
                        <div slot="widget-content">
                            <v-list v-for="(reqs,i) in minor_missing_reqs" :key="i" class="text-xs-center fill-height layout column justify-center align-center ma-0"> <!--Added-->
                                <v-subheader>Requirement #{{i+1}}{{`${reqs.choose>1?'Choose '+reqs.choose:''}`}}</v-subheader>
                                <v-list-tile v-for="req in reqs.classes" :key="req.name">
                                    <v-list-tile-content class="text-xs-center fill-height layout column justify-center align-center ma-0"> <!--Added-->
                                        <v-list-tile-title v-text="req.name"></v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        </div>
                    </v-widget>
                </v-flex>
                <v-flex md4 sm12 xs12>
                    <v-widget title="Progress">
                        <v-btn slot="widget-header-action" flat>
                            <span>Update Info</span>
                            <v-icon class="text--secondary" right>refresh</v-icon>
                        </v-btn>
                        <div slot="widget-content">
                            You are doin' friggin fantastic keep up the good work!
                        </div>
                    </v-widget>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
import CircleStatistic from '@/components/CircleStatistic'
import MiniStatistic from '@/components/MiniStatistic'
import LinearStatistic from '@/components/LinearStatistic'
import VWidget from '@/components/VWidget'
export default {
    data() {
            return {
                number_of_core_requirements: 14
            }
        },
        async asyncData({
            app: {
                $api
            },
            redirect
        }) {
            const resp = await $api.dashboard.getProgress()
            if (resp.ok === false) {
                redirect('/')
                    //no data to display probably should send them to onboarding
            }
            return resp
        },
        computed: {
            total_credits_completion() {
                return Math.min((this.total_credits_applied / this.total_credits_required * 100).toFixed(0), 100) || 0
            },
            core_credits_completion() {
                return Math.min((this.core_credits_applied / this.core_credits_required * 100).toFixed(0), 100) || 0
            },
            major_credits_completion() {
                return Math.min((this.major_credits_applied / this.major_credits_required * 100).toFixed(0), 100) || 0
            },
            minor_credits_completion() {
                return Math.min((this.minor_credits_applied / this.minor_credits_required * 100).toFixed(0), 100) || 0
            },
            core_requirements_completion() {
                return Math.min(((this.number_of_core_requirements - this.missing_attributes.length) / this.number_of_core_requirements * 100).toFixed(0), 100)
            },
            core_requirements_left() {
                return this.missing_attributes.length
            },
            major_requirements_left() {
                return this.major_missing_reqs.reduce((sum, {
                    choose
                }) => sum + choose, 0)
            },
            minor_requirements_left() {
                return this.minor_missing_reqs.reduce((sum, {
                    choose
                }) => sum + choose, 0)
            },
            total_requirements_left() {
                return this.minor_requirements_left + this.major_requirements_left + this.core_requirements_left
            }
        },
        components: {
            CircleStatistic,
            LinearStatistic,
            MiniStatistic,
            VWidget
        }
}
</script>
