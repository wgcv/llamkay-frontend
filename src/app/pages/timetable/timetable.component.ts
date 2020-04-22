import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.sass']
})
export class TimetableComponent implements OnInit {

  initDate = new FormControl(moment().startOf('isoWeek').toISOString());
  finalDate = new FormControl(moment().endOf('isoWeek').toISOString());
  dateList = this.getDates(new Date(this.initDate.value), new Date(this.finalDate.value))
  hourList = ['0h00', '0h30', '1h00','1h30','2h00','2h30','3h00','3h30','4h00','4h30','5h00','5h30','6h00','6h30','7h00','7h30','8h00','8h30','9h00','9h30','10h00','10h30','11h00','11h30','12h00','12h30','13h30','14h00','14h30','15h00','15h30','16h00','16h30','17h00','17h30','18h00','18h30','19h00','19h30','20h00','20h30','21h00','21h30','22h00','22h30','23h00','23h30']
  sessionColors = ['#94d82e', '#3273dc', '#209cee', '#48c774', '#c35500', '#544D69', '#687f00']
  userId: string
  user: User
  timetableResult:Array<any>
  constructor(private spinner: NgxSpinnerService, private tasksService: TasksService, private userService:UsersService, private router: Router, private activatedRoute: ActivatedRoute) { }
  showTimeable: boolean = false

  ngOnInit(): void {
    moment.locale('es')
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get("id")
      this.showTimeable = false
      this.getTimeTable()
      this.userService.getUser(this.userId).subscribe(data=>{
        this.user = data
      })
    })
    this.initDate.valueChanges.subscribe(data=>{
      this.dateList = this.getDates(new Date(this.initDate.value), new Date(this.finalDate.value))
      this.showTimeable = false
      this.getTimeTable()
    })
    this.finalDate.valueChanges.subscribe(data=>{
      this.dateList = this.getDates(new Date(this.initDate.value), new Date(this.finalDate.value))
      this.showTimeable = false
      this.getTimeTable()
    })
  }


  getTimeTable(){
    this.spinner.show();
    this.tasksService.getTimetable(this.userId, this.initDate.value, this.finalDate.value).subscribe(data=> {
      this.spinner.hide()
      this.showTimeable = true
      this.timetableResult = []
      let startFormat_last, DayStart_last
      for (let i=0; i<data.length; i++){
        let start = moment(data[i].detail.timestamp)
        if(start.minutes()<15){
          start = start.set({minute:0,second:0,millisecond:0})
        }else if (start.minutes()<45){
          start = start.set({minute:30,second:0,millisecond:0})
        }else{
          start = start.set({hour:start.hours()+1,minute:30,second:0,millisecond:0})
        }

        let time = Math.floor(data[i].detail.seconds/1800)
        if((data[i].detail.seconds%1800)>14){
          time += 1
        }
        if(time<1){
          time = 1
        }
        let finish = moment(start).add("minutes", time*30)

        let startFormat = "time-"
        if(start.hours()<10){
          startFormat += '0'+start.hours()
        }else{
          startFormat += start.hours()
        }
        if(start.minutes()<10){
          startFormat += '0'+start.minutes()
        }else{
          startFormat += start.minutes()
        }
        let finishFormat = "time-"
        if(finish.hours()<10){
          finishFormat += '0'+finish.hours()
        }else{
          finishFormat += finish.hours()
        }
        if(finish.minutes()<10){
          finishFormat += '0'+finish.minutes()
        }else{
          finishFormat += finish.minutes()
        }
        if (!(startFormat_last === startFormat  && DayStart_last ===start.diff(moment(this.initDate.value), 'days'))){
          this.timetableResult.push({
            _id: data[i]._id,
            name: data[i].name,
            startFormat: startFormat,
            finishFormat: finishFormat,
            dayStart: start.diff(moment(this.initDate.value), 'days'),
            startTime: moment(data[i].detail.timestamp).format("HH[h]mm"),
            endTime: moment(data[i].detail.timestamp).add("seconds", data[i].detail.seconds).format("HH[h]mm"),
            time: time,
            totalTime: data[i].time,
            color: this.getRandomColor(),
            tasks:[]
          })
        }else{

          let addTask = this.timetableResult[this.timetableResult.length-1]
          if(addTask.time>time){
            addTask.tasks.push({
              _id: data[i]._id,
              name: data[i].name,
              startFormat: startFormat,
              finishFormat: finishFormat,
              dayStart: start.diff(moment(this.initDate.value), 'days'),
              startTime: moment(data[i].detail.timestamp).format("HH[h]mm"),
              endTime: moment(data[i].detail.timestamp).add("seconds", data[i].detail.seconds).format("HH[h]mm"),
              color: this.getRandomColor(),
              time: time,
              totalTime: data[i].time,
            })
          }else{
            addTask.tasks.push({
              _id: addTask._id,
              name: addTask.name,
              startFormat: addTask.startFormat,
              finishFormat: addTask.finishFormat,
              dayStart: addTask.dayStart,
              startTime: addTask.startTime,
              endTime: addTask.endTime,
              color: addTask.color,
              time: addTask.time,
              totalTime: addTask.totalTime,
            })
            addTask._id = data[i]._id
            addTask.name = data[i].name,
            addTask.startFormat = startFormat,
            addTask.finishFormat = finishFormat,
            addTask.dayStart = start.diff(moment(this.initDate.value), 'days'),
            addTask.startTime = moment(data[i].detail.timestamp).format("HH[h]mm"),
            addTask.endTime = moment(data[i].detail.timestamp).add("seconds", data[i].detail.seconds).format("HH[h]mm"),
            addTask.color = this.getRandomColor(),
            addTask.time = time,
            addTask.totalTime = data[i].time
          }
          this.timetableResult[this.timetableResult.length-1] = addTask
        }
        startFormat_last = startFormat
        DayStart_last = start.diff(moment(this.initDate.value), 'days')
      }
    })
  }
  getDates (startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };
  formatDate(date){
    if(date){
      let dateTxt = moment(date).format("dddd D MMMM")
      return dateTxt.charAt(0).toUpperCase() + dateTxt.slice(1);
    }else{
      return ''
    }
   }
   formatTime(time) {
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
      return '0h00m'
    }
 
 }
   getRandomColor(){
     return this.sessionColors[(Math.floor(Math.random() * (this.sessionColors.length)))]
   }
}
