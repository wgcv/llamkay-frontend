import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent implements OnInit {
  userList: [User]
  showTable: boolean = false
  constructor(private spinner: NgxSpinnerService, private userService: UsersService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getUsers()

  }
  getUsers(){
    this.userService.getUsers().subscribe((data) => {
      this.userList = data.docs
      this.showTable = true
      this.spinner.hide()
      }, (err)=>{
        console.log(err)
        if(err.statusText==='Unknown Error'){
          this.getUsers()
        }else{
          this.snackBar.open("Por favor actualicé la página, se produjo error: '"+ err.message+"'", 'Error', {
            duration: 5000,
          });
        }
      })
  }
  onSearch(event){
    this.userService.searchUsers(event.target.value).subscribe((data) => {
      this.userList = data.docs
      });
  }
  onClickUser(id){
    this.router.navigateByUrl('user/'+id)
  }
}
