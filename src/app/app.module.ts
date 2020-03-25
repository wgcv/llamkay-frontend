import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { Host } from './config/host';
import { JWT_OPTIONS, JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { RefreshTokenInterceptor } from './guards/refresh-token';
import { TokenInterceptor } from './guards/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { SigninComponent } from './pages/signin/signin.component';

import { UsersService } from './services/users/users.service';
import { AuthGuard } from './guards/auth.guards';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarComponent } from './components/menubar/menubar.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';

function jwtOptionsFactory(usersService: UsersService) {
  return {
    tokenGetter: () => {
      return usersService.getAccessToken();
    },
    whitelistedDomains: [Host.host]
  };
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    UserAddComponent,
    UserListComponent,
    SigninComponent,
    MenubarComponent,
    UserDetailComponent,
    DownloadsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [UsersService]
      }
    }),
  ],
  providers: [ CookieService,
    // Providing JwtInterceptor allow to inject JwtInterceptor manually into RefreshTokenInterceptor
    JwtInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    AuthGuard,UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
