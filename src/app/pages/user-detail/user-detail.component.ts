import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';

import { Router, ActivatedRoute} from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Task } from '../../interfaces/task.interfaces';
import * as moment from 'moment';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.sass']
})
export class UserDetailComponent implements OnInit {
  userExpander: Boolean = false

  userId: string
  user: User
  activateTasks: Boolean = true
  tasksList: {
      tasks: [Task],
    }
  archiveTasksList: {
      tasks: [Task],
    }
  showTasks:[Task]
  total: number
  todayTime: number
  weekTime: number
  archiveTasks: [Task]
  updateApi: any 
  initDate =  moment().subtract(6,'d');
  finalDate = moment();
  dateList = this.getDates(this.initDate.toDate(), this.finalDate.toDate())
  hourList = ['0h00', '0h30', '1h00','1h30','2h00','2h30','3h00','3h30','4h00','4h30','5h00','5h30','6h00','6h30','7h00','7h30','8h00','8h30','9h00','9h30','10h00','10h30','11h00','11h30','12h00','12h30','13h30','14h00','14h30','15h00','15h30','16h00','16h30','17h00','17h30','18h00','18h30','19h00','19h30','20h00','20h30','21h00','21h30','22h00','22h30','23h00','23h30']
  sessionColors = ['#94d82e', '#3273dc', '#209cee', '#48c774', '#c35500', '#544D69', '#687f00']
  timetableResult:Array<any>

  constructor(private userService: UsersService, private tasksService: TasksService, private router: Router, private matDialog: MatDialog, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    moment.locale('es')
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get("id")
      this.userService.getUser(this.userId).subscribe((data) => {
        this.user = data
      })
      this.getTimeTable()
    });

  
    this.callUpdateApi()
    this.updateApi = setInterval(() => {
      this.callUpdateApi()
    },120000)
  }
 
  callUpdateApi(){
    let now = (moment().set({hour:23,minute:59,second:59,millisecond:999}).utc()).toISOString()
    let before1day = (moment().set({hour:0,minute:0,second:0,millisecond:0}).utc()).toISOString()
    let lastMonday =   (moment().set({hour:0,minute:0,second:0,millisecond:0})).startOf('week').isoWeekday(1).toISOString()
    if(this.activateTasks){
      this.tasksService.getTasks(this.userId).subscribe((data) => {
        this.tasksList = {
          tasks: data.docs
        }
      this.total= data.totalDocs
      this.showTasks = this.tasksList.tasks
      });
    }else{
      this.tasksService.getArchiveTasks(this.userId).subscribe((data) => {
        this.archiveTasksList = {
          tasks: data.docs
        }
      this.total= data.totalDocs
      this.showTasks = this.archiveTasksList.tasks
      });
    }
    this.tasksService.getStats(this.userId, before1day, now).subscribe((data) => {
      if(data.length>0){
      this.todayTime = data[0].count
      }
    })
    this.tasksService.getStats(this.userId, lastMonday, now).subscribe((data) => {
      if(data.length>0){
        this.weekTime = data[0].count
      }
    })
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
onClickTask(id){
  this.router.navigateByUrl('task/'+id)

}

formatDate(date){
  if(date){
    let dateTxt = moment(date).format("dddd, D MMMM YYYY h:mm:ss A")
    return dateTxt.charAt(0).toUpperCase() + dateTxt.slice(1);
  }else{
    return ''
  }
 }
 clickActivateTasks(){
  this.activateTasks = true;
  this.tasksService.getTasks(this.userId).subscribe((data) => {
    this.tasksList = {
      tasks: data.docs
    }
    this.showTasks = this.tasksList.tasks
  })
 }
 clickArchiveTasks(){
  this.activateTasks = false;
  this.tasksService.getArchiveTasks(this.userId).subscribe((data) => {
    this.archiveTasksList = {
      tasks: data.docs
    }

    this.showTasks = this.archiveTasksList.tasks
  })
}
sendPasswordRecovery(): void {
  const dialogRef = this.matDialog.open(DialogComponent, {
    data: "Seguro que quiere enviar solictud de cambio de contraseña?"
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      this.userService.generateRecoveryPasswordUser(this.user._id).subscribe((data)=>{
        this.snackBar.open('Se envió el correo para cambiar contraseña', 'Listo', {
          duration: 5000,
        });
      })
    }
  }, (err)=>{
      console.log(err)
  });
}
userClick(){
  this.userExpander = !this.userExpander
}

removeUser(){
  const dialogRef = this.matDialog.open(DialogComponent, {
    data: "Seguro desea borrar a "+this.user.firstname +" " +this.user.lastname+"? Esta acción es permanente y no es recuperable."
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      this.userService.deleteUser(this.user).subscribe(res=>{
        this.snackBar.open('Se elminó el colaborador', 'Listo', {
          duration: 5000,
        });
        this.router.navigate(['/users']);
      },(err)=>{
        console.log(err)
        if(err.error){
          if(err.error.message==="You can not remove your own user"){
            this.snackBar.open('No puedes eliminar tu propio usuario', 'Corregir', {
              duration: 5000,
            })
          }
        }
    })
  }}, (err)=>{
      console.log(err)
  });
}
makeAdmin(admin){
  let message = ''
  let confirmMessage = ''

  if(admin){
    message = "Seguro desea asignar a "+this.user.firstname +" " +this.user.lastname+" como administrador?"
    confirmMessage = "Se asignó con éxito"
  }else{
    message = "Seguro desea quitar a "+this.user.firstname +" " +this.user.lastname+" como administrador?"
    confirmMessage = "Se quitó privilegios con éxito"

  }
  const dialogRef = this.matDialog.open(DialogComponent, {
    data: "Seguro desea asignar a "+this.user.firstname +" " +this.user.lastname+" como administrador?"
  });
  dialogRef.afterClosed().subscribe(result => {
  this.userService.setAdminUser(this.user._id, {isAdmin: admin}).subscribe(data=>{
    this.user = data
    this.snackBar.open(confirmMessage, 'Listo', {
      duration: 5000,
    });
  }, err =>{
    if(err.error){
      if(err.error.message === "The user is the same"){
        this.snackBar.open("No puede realizar esta acción sobre tu usuario", 'Listo', {
          duration: 5000,
        });
      }
    }
  })
})
}


getTimeTable(){
  this.tasksService.getTimetable(this.userId, this.initDate.toISOString(), this.finalDate.toISOString()).subscribe(data=> {

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
      if (!(startFormat_last === startFormat  && DayStart_last ===start.diff(moment(this.initDate), 'days'))){
        this.timetableResult.push({
          _id: data[i]._id,
          name: data[i].name,
          startFormat: startFormat,
          finishFormat: finishFormat,
          dayStart: start.diff(moment(this.initDate), 'days'),
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
            dayStart: start.diff(moment(this.initDate), 'days'),
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
          addTask.dayStart = start.diff(moment(this.initDate), 'days'),
          addTask.startTime = moment(data[i].detail.timestamp).format("HH[h]mm"),
          addTask.endTime = moment(data[i].detail.timestamp).add("seconds", data[i].detail.seconds).format("HH[h]mm"),
          addTask.color = this.getRandomColor(),
          addTask.time = time,
          addTask.totalTime = data[i].time
        }
        this.timetableResult[this.timetableResult.length-1] = addTask
      }
      startFormat_last = startFormat
      DayStart_last = start.diff(moment(this.initDate), 'days')
    }
  })
}
formatDateShort(date){
  if(date){
    let dateTxt = moment(date).format("dddd D MMMM")
    return dateTxt.charAt(0).toUpperCase() + dateTxt.slice(1);
  }else{
    return ''
  }
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
}
getRandomColor(){
  return this.sessionColors[(Math.floor(Math.random() * (this.sessionColors.length)))]
}
}
