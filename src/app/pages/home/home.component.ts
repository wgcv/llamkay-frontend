import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      sessionStorage.setItem('cupon', params['cupon'])
  });
  }
  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;


  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }
 
  isLogin(){
   return this.userService.haveToken()
  }



}
