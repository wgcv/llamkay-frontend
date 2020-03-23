import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatSeconds'
  })
  export class FormatSeconds implements PipeTransform {
  
      transform(value) {
        let time = parseInt(value)

            if(time>=0){
             let hours = Math.floor(time / 3600)
             time %= 3600
             let minutes = Math.floor(time / 60)
             let seconds = time % 60
             let hoursTxt = hours.toString()
             let minutesTxt = minutes.toString()
             let secondsTxt = seconds.toString()
             if (minutes < 10) {
               minutesTxt = '0' + minutes
             }
             if (seconds < 10) {
               secondsTxt = '0' + seconds
             }
           return  hoursTxt + 'h' + minutesTxt + 'm'
            }else{
              return ''
            }
          
      }
  }