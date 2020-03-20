import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Company } from '../../interfaces/company.interface';

import { Auth } from '../../interfaces/auth.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})
export class SigninComponent implements OnInit {
  @ViewChild('btnRegister') btnRegister: ElementRef;
  @ViewChild('txtMail') txtMail: ElementRef;
  @ViewChild('errorMail') errorMail: ElementRef;
  @ViewChild('txtFirstname') txtFirstname: ElementRef;
  @ViewChild('errorFirstname') errorFirstname: ElementRef;
  @ViewChild('txtLastname') txtLastname: ElementRef;
  @ViewChild('errorLastname') errorLastname: ElementRef;
  @ViewChild('txtCompany') txtCompany: ElementRef;
  @ViewChild('errorCompany') errorCompany: ElementRef;
  @ViewChild('txtPassword') txtPassword: ElementRef;
  @ViewChild('errorPassword') errorPassword: ElementRef;

  @ViewChild('msgError') msgError: ElementRef;
  error: Boolean = false;
  user: User;
  company: Company;
  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar) { }
 
  ngOnInit(): void {
    if (this.userService.haveToken()) {
      this.router.navigateByUrl('/dashboard');
    }
  }
  bluertxtMail(e) {
    if (this.txtMail.nativeElement.value == "") {
      this.txtMail.nativeElement.classList.add("is-danger");
      this.errorMail.nativeElement.innerHTML = "Es necesario un correo";
      this.errorMail.nativeElement.style.display = "inline-block"

      this.error = true;
    } else if (!this.validateEmail(this.txtMail.nativeElement.value)) {
      this.error = true;
      this.txtMail.nativeElement.classList.add("is-danger");
      this.errorMail.nativeElement.innerHTML =  "El correo no es válido";
      this.errorMail.nativeElement.style.display = "inline-block"
    } else {
      this.txtMail.nativeElement.classList.remove("is-danger");
      this.errorMail.nativeElement.innerHTML = "";
      this.errorMail.nativeElement.style.display = "none"
    }
  }  

  bluertxtFirstname(e) {
    if (this.txtFirstname.nativeElement.value == "") {
      this.txtFirstname.nativeElement.classList.add("is-danger");
      this.errorFirstname.nativeElement.innerHTML = "Es necesario un nombre";
      this.errorFirstname.nativeElement.style.display = "inline-block"

      this.error = true;
    } else {
      this.txtFirstname.nativeElement.classList.remove("is-danger");
      this.errorFirstname.nativeElement.innerHTML = "";
      this.errorFirstname.nativeElement.style.display = "none"
    }
  }

    bluertxtLastname(e) {
      if (this.txtLastname.nativeElement.value == "") {
        this.txtLastname.nativeElement.classList.add("is-danger");
        this.errorLastname.nativeElement.innerHTML = "Es necesario un apellido";
        this.errorLastname.nativeElement.style.display = "inline-block"
  
        this.error = true;
      } else {
        this.txtLastname.nativeElement.classList.remove("is-danger");
        this.errorLastname.nativeElement.innerHTML = "";
        this.errorFirstname.nativeElement.style.display = "none"
      }
    }
    bluertxtCompany(e) {
      if (this.txtCompany.nativeElement.value == "") {
        this.txtCompany.nativeElement.classList.add("is-danger");
        this.errorCompany.nativeElement.innerHTML = "Es necesario especificar una empresa";
        this.errorCompany.nativeElement.style.display = "inline-block"
  
        this.error = true;
      } else {
        this.txtCompany.nativeElement.classList.remove("is-danger");
        this.errorCompany.nativeElement.innerHTML = "";
        this.errorCompany.nativeElement.style.display = "none"
      }
    }
  bluertxtPassword(e) {
    if (this.txtPassword.nativeElement.value == "") {
      this.txtPassword.nativeElement.classList.add("is-danger");
      this.errorPassword.nativeElement.innerHTML = "Es necesario una contraseña";
      this.errorPassword.nativeElement.style.display = "inline-block"

      this.error = true;
    } else if(this.txtPassword.nativeElement.value.length < 7){
      this.txtPassword.nativeElement.classList.add("is-danger");
      this.errorPassword.nativeElement.innerHTML = "Lave mínima es de 7 caracteres";
      this.errorPassword.nativeElement.style.display = "inline-block"

      this.error = true;
    }
    
    else {
      this.txtPassword.nativeElement.classList.remove("is-danger");
      this.errorPassword.nativeElement.innerHTML = "";
      this.errorPassword.nativeElement.style.display = "none"
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  submitRegister(){
    if ((this.txtMail.nativeElement.value == "") || (!this.validateEmail(this.txtMail.nativeElement.value))) {
      this.snackBar.open("Todos los campos son requeridos", 'Corregir', {
        duration: 5000,
      });
       return true
       ;}
    if ((this.txtFirstname.nativeElement.value == "") || (this.txtLastname.nativeElement.value == "")) { 
      this.snackBar.open("Todos los campos son requeridos", 'Corregir', {
        duration: 5000,
      });return true;
    }
    if ((this.txtCompany.nativeElement.value == "") || (this.txtPassword.nativeElement.value == "") || (this.txtPassword.nativeElement.value.length < 7)) { 
      this.snackBar.open("Todos los campos son requeridos", 'Corregir', {
        duration: 5000,
      });
      return true;
    }
      this.user = this.userService.user(null, this.txtMail.nativeElement.value, this.txtFirstname.nativeElement.value, this.txtLastname.nativeElement.value, this.txtPassword.nativeElement.value,null, null, null, null, null);
      this.company = {"_id":null, "logo":null, "name": this.txtCompany.nativeElement.value}
      this.userService.registerNewUser({"user":this.user, "company": this.company}).subscribe(data => {
        this.snackBar.open("Se registro con éxito", 'Cerrar', {
          duration: 5000,
        });
        this.router.navigateByUrl('/login');
      }, (error: any) => {
        let errorText = '';
                if (error.error.code == 11000) {
                errorText = 'Error: ' + 'El correo ya se encuentra registrado.';
                } 

        this.snackBar.open(errorText, 'Corregir', {
          duration: 5000,
        });
      });
      return false;
  }

}
