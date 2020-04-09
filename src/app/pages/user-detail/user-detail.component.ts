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

  constructor(private userService: UsersService, private tasksService: TasksService, private router: Router, private matDialog: MatDialog, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }

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
}
