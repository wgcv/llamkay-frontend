import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.sass']
})
export class MenubarComponent implements OnInit {

  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar) { }
  userExpander: Boolean = false

  ngOnInit(): void {
  }
  userClick(){
    this.userExpander = !this.userExpander
  }
  logout(){
    this.userService.logout();
    this.router.navigateByUrl('/');

  }
}
