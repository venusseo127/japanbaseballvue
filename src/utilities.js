import { defineStore } from 'pinia';
import moment from 'moment';

//var moment = require('moment');
export const utilities = defineStore('utility', {
  actions: {

    round(num, places){
      num = parseFloat(num);
      places = (places ? parseInt(places, 10) : 0)
      if (places > 0) {
          let length = places;
          places = "1";
          for (let i = 0; i < length; i++) {
              places += "0";
              places = parseInt(places, 10);
          }
      } else {
          places = 1;
      }
      return Math.round((num + Number.EPSILON) * (1 * places)) / (1 * places)
    },

    isNullOrUndefined (object){
      if (object === undefined || object === null){
        return true
      } else {
        return false
      }
    },

    addOffsetToDate (pJSDateValue) {
      const offset = pJSDateValue.getTimezoneOffset()
      const returnDateValue = new Date(pJSDateValue.getTime() - (offset*60*1000))
      return returnDateValue
    },

    convertInputDateTimeTZ_MinusOffset(pJSDateValue, pTZ) {
      const offset = pJSDateValue.getTimezoneOffset()
      const receivedDate = new Date(pJSDateValue.getTime() + (offset*60*1000))
      const returnDateValue = moment(receivedDate).tz(pTZ, true)
      return returnDateValue
    },

    convertInputDateTimeTZ(pJSDateValue, pTZ='America/New_York') {
      const returnDateValue = moment(pJSDateValue).tz(pTZ, true)
      return returnDateValue
    },

    convertDisplayDateTimeTZ(pJSDateValue, pTZ='America/New_York') {
      const returnDateValue = moment(pJSDateValue).tz(pTZ)
      return returnDateValue
    },
    convertDisplayDateTimeTZMinus2H(pJSDateValue, pTZ)  {
      let returnDateValue = moment(pJSDateValue).tz(pTZ)
      let NewreturnDateValue = returnDateValue.subtract(2, 'hours')
      return NewreturnDateValue
    },
    convertToMomentMinus2H(pJSDateValue){
      let returnDateValue = moment(pJSDateValue)
      let NewreturnDateValue = returnDateValue.subtract(2, 'hours')
      return NewreturnDateValue
    },
    convertStoreDateTimeTZ(pJSDateValue) {
      let receivedDate = new Date(pJSDateValue.getFullYear(), pJSDateValue.getMonth(),
        pJSDateValue.getDate(), pJSDateValue.getHours(), pJSDateValue.getMinutes(), pJSDateValue.getSeconds())
      const returnDateValue = moment(receivedDate).utc()
      return returnDateValue
    },

    convertToMoment(pJSDateValue){
      const returnDateValue = moment(pJSDateValue)
      return returnDateValue
    },

    convertToMomentTimeDiff(endTime,startTime) {
      const returnDateValue = moment.duration(endTime.diff(startTime))
      return returnDateValue
    },
    convertToMomentDaysDiff(endTime,startTime) {
      const returnDateValue = moment.duration(startTime.diff(endTime)).asDays();
      return returnDateValue
    },
    convertToMomentDaysDiffToday(dateVal){
      var current = moment().startOf('day');
      const returnDateValue = moment.duration(dateVal.diff(current)).asDays();
      return returnDateValue
    },
    getTZNames() {
      let returnValue = []
      const names = moment.tz.names()
      names.forEach((name) => {
        const offset = moment(new Date()).tz(name).format('z')
        const nameWithOffset = moment(new Date()).tz(name).format('Z z')
        returnValue.push({
          value: offset + "|" + name,
          label: name + " " + nameWithOffset
        })
      })
      return returnValue
    },

    getDateISOFormat(date){
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [year, month, day].join('-');
    },

    get12HourSuffix (pValue){
      let sValue = ''
      if (pValue.toString().substring(1,1)=='0'){
        sValue = pValue.toString().substring(2,2)
      } else {
        sValue = pValue
      }
      if (parseFloat(sValue) >= 12){
        return 'PM'
      } else {
        return 'AM'
      }
    },
    get12HourValue(pValue){
      let sValue = ''
      if (pValue.toString().substring(0,1)=='0'){
        sValue = pValue.toString().substring(1,2)
      } else {
        sValue = pValue
      }
      if (parseFloat(sValue) == 0){
        return '12'
      } else
      if (parseFloat(sValue) > 12){
        return parseFloat(sValue)-12
      } else {
        return sValue
      }
    },
    getMinutesFormat (pValue){
      if (parseFloat(pValue) < 10){
        return '0' + pValue.toString()
      } else {
        return pValue
      }
    },

    getMonthFormat (pValue){
      if (parseFloat(pValue) < 10){
        return '0' + pValue.toString()
      } else {
        return pValue
      }
    },

    // var aDay = 24 * 60 * 60 * 1000;
    // console.log(time_ago(new Date(Date.now() - aDay)));
    // console.log(time_ago(new Date(Date.now() - aDay * 2)));

    timeago(time) {
      switch (typeof time) {
        case 'number':
          break;
        case 'string':
          time = +new Date(time);
          break;
        case 'object':
          if (time.constructor === Date) time = time.getTime();
          break;
        default:
          time = +new Date();
      }
      var time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ];
      var seconds = (+new Date() - time) / 1000,
        token = 'ago',
        list_choice = 1;

      if (seconds == 0) {
        return 'Just now'
      }
      if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
      }
      var i = 0, format;
      while (format == time_formats[i++])
        if (seconds < format[0]) {
          if (typeof format[2] == 'string')
            return format[list_choice];
          else
            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
      return time;
    }
  }
})
// export.distanceAndDuration= (from,to) => {

// }
