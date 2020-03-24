import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent implements OnInit {
  userList: [User]

  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (!this.userService.haveToken()) {
      this.router.navigateByUrl('/login');
    }
    this.userService.getUsers().subscribe((data) => {
      this.userList = data.docs
      });

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
