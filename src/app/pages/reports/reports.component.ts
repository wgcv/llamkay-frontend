import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass']
})
export class ReportsComponent implements OnInit {
  initDate = new FormControl((new Date(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString());
  finalDate = new FormControl((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).toISOString());
  reportResult = null
  constructor(private spinner: NgxSpinnerService, private tasksService: TasksService, private userService:UsersService, private router: Router, private activatedRoute: ActivatedRoute) { }
  showReport: boolean = false

  ngOnInit(): void {
    this.report()
    this.initDate.valueChanges.subscribe(data=>{
      this.report()
    })
    this.finalDate.valueChanges.subscribe(data=>{
      this.report()
    })
  }
  report(){
    this.showReport = false
    this.spinner.show();
   this.tasksService.getReportStats(this.initDate.value, this.finalDate.value).subscribe(data=>{
    this.spinner.hide()
    this.showReport = true

    this.reportResult = data
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
}
