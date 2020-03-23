import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';

import { Router, ActivatedRoute} from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Task } from '../../interfaces/task.interfaces';
import * as moment from 'moment';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.sass']
})
export class UserDetailComponent implements OnInit {

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

  constructor(private userService: UsersService, private tasksService: TasksService, private router: Router, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    moment.locale('es')
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get("id")
      this.userService.getUser(this.userId).subscribe((data) => {
        this.user = data
      })
    });

  
    this.callUpdateApi()
    this.updateApi = setInterval(() => {
      this.callUpdateApi()
    },120000)
  }
 
  callUpdateApi(){
    let now = (moment().set({hour:23,minute:59,second:59,millisecond:999}).utc()).toISOString()
    let before1day = (moment().set({hour:0,minute:0,second:0,millisecond:0}).utc()).toISOString()
    let before7days =   (moment().set({hour:0,minute:0,second:0,millisecond:0}).utc()).subtract(7,"days").toISOString()
    if(this.activateTasks){
      this.tasksService.getTasks(this.userId).subscribe((data) => {
        this.tasksList = {
          tasks: data.docs
        }
        console.log(data)
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
    
    this.tasksService.getStats(this.userId, before7days, now).subscribe((data) => {
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
    console.log(data)
    this.archiveTasksList = {
      tasks: data.docs
    }

    this.showTasks = this.archiveTasksList.tasks
  })
}



}
