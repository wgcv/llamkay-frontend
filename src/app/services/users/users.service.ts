import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../interfaces/auth.interface';
import { User } from '../../interfaces/user.interface';
import { Pagination } from '../../interfaces/pagination.interface';

import { CookieService } from 'ngx-cookie-service';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

import { Host } from '../../config/host';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
@Injectable()
export class UsersService {
  authToken: Auth;

  constructor(@Inject(HttpClient) private http: HttpClient, 
              @Inject(CookieService) private cookieService: CookieService,

              @Inject(Router) private router: Router) { }

  authenticateUser(user: User) {
    return this.http.post<Auth>(Host.url + '/auth/login/', user)
      .pipe(map(res => res));
  }
  registerNewUser(userAndComapny: any) {
    return this.http.post<User>(Host.url + '/new/users/', userAndComapny)
      .pipe(map(res => res));
  }

  registerUser(user: User) {
    return this.http.post<User>(Host.url + '/users/', user)
      .pipe(map(res => res));
  }
  recoveryPasswordUser(user: User) {
    return this.http.post<User>(Host.url + '/auth/recovery-password/', user)
      .pipe(map(res => res));
  }
  getUsers() {
    return this.http.get<Pagination>(Host.url + '/users/')
      .pipe(map(res => res));
  }

  getUser(id) {
    return this.http.get<User>(Host.url + '/users/'+id)
      .pipe(map(res => res));
  }
  searchUsers(query) {
    return this.http.get<Pagination>(Host.url + '/users?search=' + query)
      .pipe(map(res => res));
  }

  getAccessToken() {
    if(this.authToken){
      if(this.authToken.token){
        return this.authToken.token;
    }
  }
  return null;
}
  storeAuthData(auth: Auth) {
    // this.cookieService.set('refreshToken', auth.refreshToken);
    // this.cookieService.set('token', auth.token);
    this.cookieService.set('refreshToken', auth.refreshToken, 31);
    this.cookieService.set('token', auth.token, 31);
    this.authToken = auth;
  }
  loadAuth() {
    const refreshToken = this.cookieService.get('refreshToken');
    const token = this.cookieService.get('token');
    const auth = { token, refreshToken, user:null, success:null, provider:'email' };
    this.authToken = auth;
  }
  loggedIn() {
    let haveToken = this.haveToken();
    if(!haveToken){
      this.logout();
    }
    return haveToken
  }
  logout(redirect?) {
    this.authToken.token = '';
    this.authToken.refreshToken = '';
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('token');
    this.cookieService.deleteAll()
    if(redirect){
      this.router.navigate([redirect]);

    }else{
      this.router.navigate(['/login']);

    }
  }
  logoutNoRedirect() {
    this.authToken.token = '';
    this.authToken.refreshToken = '';
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('token');
    this.cookieService.deleteAll()
  }
  refresh(){
    return this.http.post<Auth>(Host.url + '/auth/refresh/', this.authToken).pipe(map(res => res));


  }
  refreshToken() {
    const refreshObservable = this.http.post<Auth>(Host.url + '/auth/refresh/', {"refreshToken": this.authToken.refreshToken});
    const refreshSubject = new ReplaySubject<Auth>(1);
    refreshSubject.subscribe((authData: Auth) => {
      this.authToken.token = authData.token;
      this.authToken.refreshToken = authData.refreshToken;

      this.storeAuthData(this.authToken);
    }, (err) => {
      this.logout();

    });

    refreshObservable.subscribe(refreshSubject);
    return refreshSubject;
  }
  haveToken() {
    this.loadAuth() 
    if (this.authToken) {
      if (this.authToken.token) {
        return true;
      }
    }
    return false;
  }

  user(_id: number, email: string, firstname: string, lastname: string, password: string, company: string, department: string, position: string, isAdmin: boolean, permissions: any, resetPasswordToken: string) {
    const user: User = {_id, email, firstname, lastname, password, company, department, position, isAdmin, permissions, resetPasswordToken};
    return user;
  }

  // company service
  createCupon(cupon: any) {
    return this.http.post<any>(Host.url + '/cupon/', cupon)
      .pipe(map(res => res));
  }
}
