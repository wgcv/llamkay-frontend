import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Company } from '../../interfaces/company.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.sass']
})
export class RecoveryPasswordComponent implements OnInit {
  @ViewChild('txtPassword') txtPassword: ElementRef;
  @ViewChild('errorPassword') errorPassword: ElementRef;
  @ViewChild('txtPasswordValidation') txtPasswordValidation: ElementRef;
  @ViewChild('errorPasswordValidation') errorPasswordValidation: ElementRef;
  @ViewChild('msgError') msgError: ElementRef;
  error: Boolean = false;
  user: User;
  resetPasswordToken: string;
  email: string;
  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }
 
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params.get("email")
      this.resetPasswordToken = params.get("token")       
  });
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
  bluertxtPasswordValidate(e) {
    if (this.txtPasswordValidation.nativeElement.value == "") {
      this.txtPasswordValidation.nativeElement.classList.add("is-danger");
      this.errorPasswordValidation.nativeElement.innerHTML = "Es necesario una contraseña";
      this.errorPasswordValidation.nativeElement.style.display = "inline-block"

      this.error = true;
    } else if(this.txtPasswordValidation.nativeElement.value.length < 7){
      this.txtPasswordValidation.nativeElement.classList.add("is-danger");
      this.errorPasswordValidation.nativeElement.innerHTML = "Lave mínima es de 7 caracteres";
      this.errorPasswordValidation.nativeElement.style.display = "inline-block"

      this.error = true;
    }
    else if(this.txtPasswordValidation.nativeElement.value !==this.txtPassword.nativeElement.value ){
      this.txtPasswordValidation.nativeElement.classList.add("is-danger");
      this.errorPasswordValidation.nativeElement.innerHTML = "Las dos contraseñas no coinciden";
      this.errorPasswordValidation.nativeElement.style.display = "inline-block"
      this.error = true;
    }
    else {
      this.txtPasswordValidation.nativeElement.classList.remove("is-danger");
      this.errorPasswordValidation.nativeElement.innerHTML = "";
      this.errorPasswordValidation.nativeElement.style.display = "none"
    }
  }

  submitPassword(){
    if ((this.txtPassword.nativeElement.value === "") || (this.txtPasswordValidation.nativeElement.value  === "") ) {
      this.snackBar.open("Todos los campos son requeridos", 'Corregir', {
        duration: 5000,
      });
       return false
       }
       if((this.txtPassword.nativeElement.value != this.txtPasswordValidation.nativeElement.value)){
        this.snackBar.open("Las contraseñas deben ser iguales", 'Corregir', {
          duration: 5000,
        });
         return false
       }

      this.user = this.userService.user(null, this.email, null, null, this.txtPassword.nativeElement.value,null, null, null,null, null, this.resetPasswordToken);
      this.userService.recoveryPasswordUser(this.user).subscribe(data => {
        console.log(data)
        this.snackBar.open("Se cambió la contraseña", 'Cerrar', {
          duration: 5000,
        });
        if(data.isAdmin){
          this.router.navigateByUrl('/login');
        }else{
          this.router.navigateByUrl('/downloads');

        }
        return false

      }, (error) => {
        console.log(error)
        let errorText = '';
        if(error){
          if(error.status == 404){
            errorText = "El usuario no es válido, genere un nuevo link desde olvidar contraseña"
          }
          if(error.error){
              if(error.error.message==="The token is not the same"){
                errorText = "El link no es válido, genere un nuevo link desde olvidar contraseña"
              }
              if(error.error.message==="Token expired"){
                errorText = "El link expiró, por favor genere un nuevo link desde olvidar contraseña"
              }
          }
        }
        this.snackBar.open(errorText, 'Corregir', {
          duration: 5000,
        });
        return false
      });
      return false
}
}
