import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { UsersService } from '../services/users/users.service';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    constructor(private userService: UsersService, private jwtInterceptor: JwtInterceptor,private jwtHelperService: JwtHelperService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            return next.handle(req).pipe(
                catchError((err) => {
                    const errorResponse = err as HttpErrorResponse;
                    if (errorResponse.status === 401) {
                        return this.userService.refreshToken().pipe(mergeMap((resAuth) => {
                            let authReq = req;
                            authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.userService.authToken.token) });

                            return next.handle(authReq);

                            // return this.jwtInterceptor.intercept(req, next);

                        }));
                    }
                    return throwError(err);
                }));
    }
}