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
    this.cookieService.set('refreshToken', auth.refreshToken);
    this.cookieService.set('token', auth.token);
    this.authToken = auth;
  }
  loadAuth() {
    const refreshToken = this.cookieService.get('refreshToken');
    const token = this.cookieService.get('token');
    const auth = { token, refreshToken, user:null, success:null, provider:'email' };
    this.authToken = auth;
  }
  loggedIn() {
    return this.haveToken();
  }
  logout() {
    this.authToken.token = '';
    this.authToken.refreshToken = '';
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('token');

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
      this.router.navigate(['/login']);

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
    this.logout();
    return false;
  }

  user(_id: number, email: string, firstname: string, lastname: string, password: string, company: string, department: string, position: string, isAdmin: boolean, permissions: any) {
    const user: User = {_id, email, firstname, lastname, password, company, department, position, isAdmin, permissions};
    return user;
  }

}
