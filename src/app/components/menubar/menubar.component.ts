import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('mobileMenu') mobileMenu: ElementRef;

  ngOnInit(): void {
  }
  userClick(){
    this.userExpander = !this.userExpander
  }
  logout(){
    this.userService.logout();
  }
  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.mobileMenu.nativeElement.classList.toggle('is-active');
  }
 
}
