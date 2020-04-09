import { Component, OnInit } from '@angular/core';

import {ViewChild, ElementRef} from '@angular/core';

import { Task } from 'src/app/interfaces/task.interfaces';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { Router, ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import { Pagination } from 'src/app/interfaces/pagination.interface';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.sass']
})
export class TaskDetailComponent implements OnInit {
  taskId: string
  task: Task
  screenshots: Pagination
  moreScreenshots: boolean = true
  chartData: any
  constructor(private tasksService: TasksService, private userService:UsersService, private router: Router, private activatedRoute: ActivatedRoute) { }
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('modalImg') modalImg: ElementRef;
  @ViewChild('modalCaption') modalCaption: ElementRef;

  ngOnInit(): void {
    moment.locale('es')
    this.activatedRoute.paramMap.subscribe(params => {
      this.taskId = params.get("id")
      console.log(this.taskId)
      this.tasksService.getTask(this.taskId).subscribe((data) => {
        console.log(data)
        
        this.task = data
        let tempData = []
        console.log(this.taskId)

        for (let i=0;i<this.task.detail.length;i++){
            tempData.push({
              name: moment(this.task.detail[i].timestamp).format("ddd D MMMM").toString() + ' a las ' + moment(this.task.detail[i].timestamp).format("hh:mm").toString(), 
              x:  moment(this.task.detail[i].timestamp).format("DD-MMM").toString(),
              y: (moment(this.task.detail[i].timestamp).format("HH").toString()),
              
              r: Math.trunc(this.task.detail[i].seconds)
            })         
        }
        this.chartData = [
          {
            name: data.name,
            series: tempData
          }] 
        Object.assign(this, this.chartData );
      })
      this.tasksService.getScreenshots(this.taskId, 1).subscribe((data) => {
        this.screenshots = data
        if(!data.nextPage){
          this.moreScreenshots = false
        }
      })
      
  });
}
formatDate(date){
  if(date){
    let dateTxt = moment(date).format("dddd, D MMMM YYYY h:mm:ss A")
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
    return ''
  }
}
formatTimeWithSeconds(time) {
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
 return  hoursTxt + ':' + minutesTxt + ':' + secondsTxt
  }else{
    return ''
  }
}
errorImg(errElement){
  let elementRef = errElement.target ;
  elementRef.parentElement.remove()
}
loadMoreSceenshots(){
  this.tasksService.getScreenshots(this.taskId, this.screenshots.nextPage).subscribe((data) => {
    this.screenshots.docs.push(...data.docs)
    this.screenshots.offset = data.offset
    this.screenshots.limit = data.limit
    this.screenshots.totalPages = data.totalPages
    this.screenshots.page = data.page
    this.screenshots.pagingCounter = data.pagingCounter
    this.screenshots.hasPrevPage = data.hasPrevPage
    this.screenshots.hasNextPage = data.hasNextPage
    this.screenshots.prevPage = data.prevPage
    this.screenshots.nextPage = data.nextPage
    if(!data.nextPage){
      this.moreScreenshots = false
    }

  })
  
}
clickScreenshot(event){
  let elementId = event.target ;
    this.modal.nativeElement.style.display = "block";
    this.modalImg.nativeElement.src = elementId.src;
    this.modalCaption.nativeElement.innerHTML = elementId.alt;

}
clickModal(event){
  this.modal.nativeElement.style.display = "none";

}

 // options
 showXAxis: boolean = true;
 showYAxis: boolean = true;
 gradient: boolean = false;
 showLegend: boolean = false;
 showXAxisLabel: boolean = true;
 yAxisLabel: string = 'Hora del día';
 showYAxisLabel: boolean = true;
 xAxisLabel: string = 'Día';
 maxRadius: number = 12;
 minRadius: number = 5;
 yScaleMin: number = 0;
 yScaleMax: number = 24;
 colorScheme = {
   domain: ['#504FA2']
 };

}
