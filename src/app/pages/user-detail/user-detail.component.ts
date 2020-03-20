import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router, ActivatedRoute} from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Task } from '../../interfaces/task.interfaces';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.sass']
})
export class UserDetailComponent implements OnInit {

  userId: string;
  user:User;
  userList: Task;
  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get("id")
      this.userService.getUser(this.userId).subscribe((data) => {
        this.user = data
        console.log(data)
      })
    });
  }

}
