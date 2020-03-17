import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UsersService } from '../services/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private usersService: UsersService, private router: Router) { }

    canActivate() {
        if (this.usersService.loggedIn()) {
            console.log(this.usersService)
                return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
