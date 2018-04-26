<template>
    <div>
        {{classes}}
        {{getDays}}
    </div>
</template>
<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
 
const moment = extendMoment(Moment);
export default {
    data() {
    	return {
            	mapDay:{
            		U: 7,
                    M: 1,
                    T: 2,
                    W: 3,
                    R: 4,
                    F: 5,
                    S: 6
                },
            	mapDays: {
                    M: 'Monday',
                    T: 'Tuesday',
                    W: 'Wednesday',
                    R: 'Thurdsday',
                    F: 'Friday',
                    S: 'Saturday',
                    U: 'Sunday'
                }
            }  
        },
        computed:{
        	firstAndLastDayOfClass(){
        		return [
        		moment.min(this.classes.map(({dates:[lowestDate]})=>lowestDate+'/'+(moment().year()))),
        		moment.max(this.classes.map(({dates:[lowestDate,highestDate]})=>highestDate+'/'+(moment().year())))
        		]
        	},
        	firstDayOfClass(){
        		return this.firstAndLastDayOfClass[0]
        	},
        	lastDayOfClass(){
        		return this.firstAndLastDayOfClass[1]
        	},
        	range(){
        		const days=this.dayNumbers,
        		startRange = moment(this.firstDayOfClass).day(days[0]),
        		endRange=startRange.clone().day(days.slice(-1))
        		return moment.range(startRange,endRange)
        	},
        	rangeOfDaysOfClass(){
        		return moment.range(this.firstAndLastDayOfClass)
        	},
        	getDays(){
        		const range = this.range
        		console.log(this.range)
        		return Array.from(range.by('days',{step:this.distance}))
        	},
        	dayNumbers(){
        		console.log(this.days.split('').map(day=>this.mapDay[day]))
        		return this.days.split('').map(day=>this.mapDay[day])
        	},
        	distance(){
        		if(this.dayNumbers[0]==6){
        			return 1
        		}
        		return this.dayNumbers[1]-this.dayNumbers[0]
        	}
        },
        props: ['classes','days']
}
</script>
