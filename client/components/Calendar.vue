<template>
    <v-card flat>
        <v-layout>
            <v-btn @click="previousWeek" icon :disabled="previousWeekDisabled">
                <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn :flat="week" @click="days='MTWRF'" depressed color="primary">Weekdays</v-btn>
            <v-btn :flat="mwf" @click="days='MWF'" depressed color="primary">MWF</v-btn>
            <v-btn :flat="tr" @click="days='TR'" depressed color="primary">TR</v-btn>
            <v-btn :flat="su" @click="days='SU'" depressed color="primary">Weekend</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="nextWeek" icon :disabled="nextWeekDisabled">
                <v-icon>chevron_right</v-icon>
            </v-btn>
        </v-layout>
        <v-layout>
            <div class="fill-height">
                <div class="times-block elevation-1">
                    <div style="height:72px">
                    </div>
                    <v-layout column :style="`height:${height}px`">
                        <v-flex xs12 v-for="time in times" :key="time.hour()" class="time-labels">
                            {{formatTime(time)}}
                        </v-flex>
                    </v-layout>
                </div>
            </div>
            <v-flex v-for="(day,i) in getDays" :key="i">
                <v-card class="fill-height">
                    <v-card-title class="layout column elevation-1">
                        <h1 class="title" v-text="mapDays[mapNum[day.day()]]"></h1>
                        <h2 class="title" v-text="day.date()"></h2>
                    </v-card-title>
                    <div :style="`height:${height}px`" class="time-container">
                        <div v-for="course in classesInDay[day.day()]" :key="course.index" :style="`top:${distanceBetween([course.times[0]])}px;height:${distanceBetween(course.times)}px;`" :class="['time-block',getColor(course.index),i==0?'is-blocking-times':'']">
                            <Calendar-Item :course="course" />
                        </div>
                    </div>
                </v-card>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script>
import Moment from 'moment';
import CalendarItem from './Calendar-Item';
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
                days: 'MTWRF'
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
                return this.mapNum.slice(0, -1).map((day) => {
                    return this.classes.filter(({
                        days
                    }) => days.includes(day))
                })
            },
            getHighestAndLowestTime() {
                return [
                    moment.min(this.classes.map(({
                        times: [lowestTime]
                    }) => moment(lowestTime, 'hh:mm a'))),
                    moment.max(this.classes.map(({
                        times: [lowestTime, highestTime]
                    }) => moment(highestTime, 'hh:mm a')))
                ]
            },
            lowestTime() {
                return this.getHighestAndLowestTime[0]
            },
            highestTime() {
                return this.getHighestAndLowestTime[1]
            },
            rangeOfTimes() {
                const [lowestTime, highestTime] = this.getHighestAndLowestTime
                return moment.range(lowestTime.clone().minutes(0), highestTime.clone().minutes(60))
            },
            times() {
                return Array.from(this.rangeOfTimes.by('hours'))
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
                const rangeOfTimes = this.rangeOfTimes,
                    start = moment(between.length === 1 ? this.formatTime(rangeOfTimes.start) : between[0], 'hh:mm a'),
                    end = moment(between.length === 1 ? between[0] : between[1], 'hh:mm a'),
                    startMinutes = this.getMinutes(start),
                    endMinutes = this.getMinutes(end),
                    difference = endMinutes - startMinutes,
                    calendarMinuteHeight = (this.height) / (this.getMinutes(rangeOfTimes.end.clone().add(1, 'hours')) - this.getMinutes(rangeOfTimes.start))
                return difference * calendarMinuteHeight

            },
            getMinutes(time) {
                return time.hour() * 60 + time.minutes()
            },
            formatTime(time) {
                return `${(time.hour()>12?time.hour()-12:time.hour()).toString().padStart(2,'0')}:${time.minute().toString().padStart(2,'0')} ${time.hour()>12?'pm':'am'}`
            },
            getColor(index) {
                return 'secondary'
            }
        },
        watch: {
            days(newDays) {
                const days = this.days.split('').map(day => this.mapDay[day]),
                    startRange = this.range.start.clone().day(days[0]),
                    endRange = startRange.clone().day(days.slice(-1))

                this.range = moment.range(startRange, endRange)
            }
        },
        components: {
            'Calendar-Item': CalendarItem
        }
}
</script>
<style>
.time-container {
    position: relative;
}

.time-block {
    position: absolute;
    z-index: 2;
    width: 97%;
    margin: 0 1.5%;
    box-sizing: border-box;
}

.times-block {
    z-index: 1;
    left: 0;
    right: 0;
    position: absolute;
}

.is-blocking-times {
    width: 64%;
    right: 3px;
}

.time-labels {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.5);
}

.navigation-drawer {
    padding: 0px;
}
</style>
