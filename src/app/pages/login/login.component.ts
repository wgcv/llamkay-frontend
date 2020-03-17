import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Auth } from '../../interfaces/auth.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  @ViewChild('btnLogin') btnLogin: ElementRef;
  @ViewChild('txtMail') txtMail: ElementRef;
  @ViewChild('errorMail') errorMail: ElementRef;

  @ViewChild('txtPassword') txtPassword: ElementRef;
  @ViewChild('errorPassword') errorPassword: ElementRef;

  @ViewChild('msgError') msgError: ElementRef;
  error: Boolean = false;
  user: User;

  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar,) { }
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
      this.errorMail.nativeElement.innerHTML = "El correo no es válido";
      this.errorMail.nativeElement.style.display = "inline-block"
    } else {
      this.txtMail.nativeElement.classList.remove("is-danger");
      this.errorMail.nativeElement.innerHTML = "";
      this.errorMail.nativeElement.style.display = "none"
    }
  }
  bluertxtPassword(e) {
    if (this.txtPassword.nativeElement.value == "") {
      this.txtPassword.nativeElement.classList.add("is-danger");
      this.errorPassword.nativeElement.innerHTML = "Es necesario una contraseña";
      this.errorPassword.nativeElement.style.display = "inline-block"

      this.error = true;
    } else {
      this.txtPassword.nativeElement.classList.remove("is-danger");
      this.errorPassword.nativeElement.innerHTML = "";
      this.errorPassword.nativeElement.style.display = "none"
    }
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  submitLogin() {
    if ((this.txtPassword.nativeElement.value != "" && this.validateEmail(this.txtMail.nativeElement.value) && this.txtMail.nativeElement.value != "")) {
      this.user = this.userService.user(null, this.txtMail.nativeElement.value, null, null, this.txtPassword.nativeElement.value, null, null, null, null, null);
      this.userService.authenticateUser(this.user).subscribe(authData => {
        if(authData.user.isAdmin){
          this.userService.storeAuthData(authData as Auth);
          this.router.navigateByUrl('/dashboard');
        }else{
          this.snackBar.open("El portal solo es para administradores, puede descargar la aplicación en nuestra página", 'No autorizado', {
            duration: 5000,
          });
        }
       
      }, (error: any) => {
        let errorText = '';
        for (const propError of Object.keys(error.error.errors)) {
          console.log(error.error.errors[propError] )
                if (error.error.errors[propError]  === 'Invalid e-mail or password') {
                errorText += 'Error: ' + 'Usuario o contraseña incorrecto.';
                } else {
                errorText += propError + ': ' + error.error.errors[propError];
                }
                errorText += '\n';
          }
        this.snackBar.open(errorText, 'Corregir', {
          duration: 5000,
        });
      });

    }else{
      this.snackBar.open("Todos los campos son requeridos", 'Corregir', {
        duration: 5000,
      });
    }
  }
}
