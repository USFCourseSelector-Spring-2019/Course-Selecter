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
                    <circle-statistic :icon="core_credits_completion===100?'done':'trending_up'" title="Core Requirements Completion" :sub-title="`${number_of_core_requirements-missing_attributes.length} of 14`" caption="Requirements Completed" :value="core_requirements_completion" color="green" />
                </v-flex>
                <v-flex md4 sm6 xs12>
                    <circle-statistic :icon="major_credits_completion===100?'done':'trending_up'" title="Major Credits Completion" :sub-title="`${major_credits_applied} / ${major_credits_required}`" caption="Credits Completed" :value="major_credits_completion" color="indigo" />
                </v-flex>
                <v-flex md4 sm6 xs12 v-if="minor">
                    <circle-statistic :icon="minor_credits_completion===100?'done':'trending_up'" title="Minor Credits Completion" :sub-title="`${minor_credits_applied} / ${minor_credits_required}`" caption="Credits Completed" :value="minor_credits_completion" color="red darken-2" />
                </v-flex>
                <v-flex md4 sm6 xs12>
                    <v-layout row wrap fill-height class="ma-0">
                        <v-flex sm6 xs12>
                            <v-card color="green white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="headline pt-4">{{ core_requirements_left }}</div>
                                <v-card-text>
                                    Core Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex sm6 xs12>
                            <v-card color="indigo white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="headline pt-4">{{ major_requirements_left }}</div>
                                <v-card-text>
                                    Major Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex sm6 xs12>
                            <v-card color="red darken-2 white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="headline pt-4">{{ minor_requirements_left }}</div>
                                <v-card-text>
                                    Minor Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex sm6 xs12>
                            <v-card color="yellow darken-4 white--text" class="text-xs-center fill-height layout column justify-center align-center ma-0">
                                <div class="headline pt-4">{{ total_requirements_left }}</div>
                                <v-card-text>
                                    Total Requirements Needed
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex lg4 sm12 xs12>
                    <v-widget title="Missing Cores">
                        <div slot="widget-content">
                            <v-list>
                                <v-list-tile avatar v-for="attribute in missing_attributes" :key="attribute">
                                    <v-list-tile-content>
                                        <v-list-tile-title v-text="attribute"></v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        </div>
                    </v-widget>
                </v-flex>
                <v-flex lg8 sm12 xs12>
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
                number_of_core_requirements: 14,
                "missing_attributes": [
                    "C-C1 Literature",
                    "C-D1 Philosophy",
                    "C-F AREA F: VISUAL AND PERFORMING ARTS",
                    "Service Learning"
                ],
                "major_missing_reqs": [{
                    "classes": [
                        "BIOL414"
                    ],
                    "choose": 1
                }, {
                    "classes": [
                        "BIOL331 & BIOL332",
                        "BIOL379 & BIOL380",
                        "BIOL328 & BIOL329",
                        "BIOL383 & BIOL384",
                        "BIOL381 & BIOL382",
                        "BIOL390 & BIOL391",
                        "BIOL392 & BIOL393",
                        "BIOL326 & BIOL327",
                        "ENVS410"
                    ],
                    "choose": 1
                }, {
                    "classes": [
                        "BIOL320 & BIOL321",
                        "BIOL324 & BIOL325",
                        "BIOL326 & BIOL327",
                        "BIOL328 & BIOL329",
                        "BIOL331 & BIOL332",
                        "BIOL333 & BIOL334",
                        "BIOL341 & BIOL342",
                        "BIOL346 & BIOL347",
                        "BIOL355 & BIOL356",
                        "BIOL362 & BIOL363",
                        "BIOL365 & BIOL366",
                        "BIOL379 & BIOL380",
                        "BIOL381 & BIOL382",
                        "BIOL383 & BIOL384",
                        "BIOL385 & BIOL386",
                        "BIOL390 & BIOL391",
                        "BIOL392 & BIOL393",
                        "BIOL395 & BIOL396",
                        "BIOL443 & BIOL444",
                        "BIOL485 & BIOL486"
                    ],
                    "choose": 2
                }, {
                    "classes": [
                        "4 Credits in BIOL 300:499 or 598 or 599* or ENVS 410*"
                    ],
                    "choose": 1
                }, {
                    "classes": [
                        "BIOL490 | ATTRIBUTE = BIST"
                    ],
                    "choose": 1
                }, {
                    "classes": [
                        "PHYS101",
                        "PHYS110 & PHYS210"
                    ],
                    "choose": 1
                }],
                "minor_missing_reqs": [],
                "firstname": "Bensu",
                "lastname": "Tangil",
                "level": "Junior",
                "major": "Biology",
                "total_credits_required": 128,
                "total_credits_applied": 97,
                "major_title": "Major in Biology - BS",
                "core_credits_required": 44,
                "core_credits_applied": 51,
                "major_credits_required": 65,
                "major_credits_applied": 44,
                minor: false
            }


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
                console.log(this.number_of_core_requirements, this.missing_attributes.length)
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
