import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Company } from '../../interfaces/company.interface';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.sass']
})
export class UserEditComponent implements OnInit {

  error: Boolean = false;
  user: User = this.userService.user(null,null,null,null,null,null,null,null,null,null,null);
  company: Company;

  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userService.getUser(params.get("id")).subscribe((data) => {
        this.user = data
      }, (err)=>{
        this.snackBar.open(err, 'Corregir', {
          duration: 5000,
        });
      })
  })
}

 

  submitUpdate(from :NgForm){
    if(from.valid){
      this.userService.updateUser(this.user).subscribe(data => {
        console.log(data)
        this.snackBar.open("Se actualizó colaborador", 'Cerrar', {
          duration: 5000,
        });
        this.router.navigate(['/user/', this.user._id]);
      }, (error: any) => {
        let errorText = '';
                if (error.error.code == 11000) {
                errorText = 'Error: ' + 'El correo ya se encuentra registrado.';
                } else{
                  errorText = error.error.code
                }

        this.snackBar.open(errorText, 'Corregir', {
          duration: 5000,
        });
      });    }
      
  }
}