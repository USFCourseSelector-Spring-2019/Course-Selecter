<template>
    <v-card flat>
        <v-layout>
            <v-btn @click="previousWeek" icon :disabled="previousWeekDisabled">
                <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn :flat="week" @click="days='MTWRF'" depressed>Week</v-btn>
                        <v-btn :flat="mwf" @click="days='MWF'" depressed>MWF</v-btn>
                        <v-btn :flat="tr" @click="days='TR'" depressed>TR</v-btn>
                        <v-btn :flat="su" @click="days='SU'" depressed>SU</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="nextWeek" icon :disabled="nextWeekDisabled">
                <v-icon>chevron_right</v-icon>
            </v-btn>
        </v-layout>
        <v-layout>
            <v-flex v-for="(day,i) in getDays" :key="i">
                <v-card class="fill-height">
                    <v-card-title class="layout column elevation-1">
                        <h1 class="title" v-text="mapDays[mapNum[day.day()]]"></h1>
                        <h2 class="title" v-text="day.date()"></h2>
                    </v-card-title>
                    <v-card-text :style="`height:${height}px`" class="time-container">
                        <div v-for="course in classesInDay[day.day()]" :key="course.index" :style="`top:${distanceBetween([course.times[0]])};height:${distanceBetween(course.times)};`" class="time-block">
                            {{course.times}}
                        </div>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script>
import Moment from 'moment';
import {
    extendMoment
} from 'moment-range';

const moment = extendMoment(Moment);
export default {
    data() {
            return {
                mapDay: {
                    U: 7,
                    M: 1,
                    T: 2,
                    W: 3,
                    R: 4,
                    F: 5,
                    S: 6
                },
                mapNum: ['U', 'M', 'T', 'W', 'R', 'F', 'S', 'U'],
                mapDays: {
                    M: 'Monday',
                    T: 'Tuesday',
                    W: 'Wednesday',
                    R: 'Thurdsday',
                    F: 'Friday',
                    S: 'Saturday',
                    U: 'Sunday'
                },
                range: {
                    by: () => []
                },
                height: 1000,
                days:'MTWRF'
            }
        },
        created() {
            const days = this.dayNumbers,
                startRange = moment(this.firstDayOfClass).day(days[0]),
                endRange = startRange.clone().day(days.slice(-1))
            this.range = moment.range(startRange, endRange)
        },
        computed: {
            firstAndLastDayOfClass() {
                return [
                    moment.min(this.classes.map(({
                        dates: [lowestDate]
                    }) => moment(lowestDate + '/' + (moment().year()), 'MM/DD/YYYY'))),
                    moment.max(this.classes.map(({
                        dates: [lowestDate, highestDate]
                    }) => moment(highestDate + '/' + (moment().year()), 'MM/DD/YYYY')))
                ]
            },
            nextWeekDisabled() {
                return !this.rangeOfDaysOfClass.contains(this.range.end.clone().add(1, 'weeks'))
            },
            previousWeekDisabled() {
                return !this.rangeOfDaysOfClass.contains(this.range.end.clone().subtract(1, 'weeks'))
            },
            firstDayOfClass() {
                return this.firstAndLastDayOfClass[0]
            },
            lastDayOfClass() {
                return this.firstAndLastDayOfClass[1]
            },
            rangeOfDaysOfClass() {
                return moment.range(this.firstAndLastDayOfClass)
            },
            getDays() {
                const range = this.range
                console.log(this.range)
                return Array.from(range.by('days', {
                    step: this.distance
                }))
            },
            dayNumbers() {
                return this.days.split('').map(day => this.mapDay[day])
            },
            distance() {
                if (this.dayNumbers[0] == 6) {
                    return 1
                }
                return this.dayNumbers[1] - this.dayNumbers[0]
            },
            classesInDay() {
                const mapDays = this.mapDays
                return Object.keys(mapDays).map((day) => {
                    return this.classes.filter(({
                        days
                    }) => days.includes(day))
                })
            },
            week() {
                return this.days === 'MTWRF'
            },
            mwf() {
                return this.days === 'MWF'
            },
            tr() {
                return this.days === 'TR'
            },
            su() {
                return this.days === 'SU'
            },
        },
        props: ['classes'],
        methods: {
            nextWeek() {
                const range = this.range
                this.range = moment.range(range.start.add(1, 'weeks'), range.end.add(1, 'weeks'))

            },
            previousWeek() {
                const range = this.range
                this.range = moment.range(range.start.subtract(1, 'weeks'), range.end.subtract(1, 'weeks'))
            },
            distanceBetween(between) {
                const start = between.length === 1 ? '12:00 am' : between[0],
                    end = between.length === 1 ? between[0] : between[1]
                console.log(between, start, end)
            }
        },
        watch: {
            days(newDays) {
                const days = this.days.split('').map(day => this.mapDay[day]),
                    startRange = this.range.start.clone().day(days[0]),
                    endRange = startRange.clone().day(days.slice(-1))

                this.range = moment.range(startRange, endRange)
            }
        }
}
</script>
<style>
.time-container {
    position: relative;
}

.time-block {
    position: absolute;
}
</style>
