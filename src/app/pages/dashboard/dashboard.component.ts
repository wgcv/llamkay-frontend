import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }
  goAddUser(){
    this.router.navigateByUrl('/user/add');
  }
  goUserList(){
    this.router.navigateByUrl('/users');
  }
  goTaskList(){
    this.snackBar.open("Estamos implementado nuevas características", 'Próximamente', {
      duration: 5000,
    });  
  }
  goReports(){
    this.snackBar.open("Estamos implementado nuevas características", 'Próximamente', {
      duration: 5000,
    });  
  }
}